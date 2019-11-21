/* eslint-disable max-lines */
import EventEmitter from 'eventemitter3';

import {
  deserializeClientMessage,
  serializeResponse,
  serializeRequest
} from './serializers';

import { parse as parseAddress, resolveBaseUrl } from '../address';
import { getUserIdFromPublicKey, getKeyPairFromMnemonic } from '../crypto';
import { getAuthorizationHeader } from '../authentication';

const PING_LATENCY = 2000; // 2 seconds
const RECONNECT_INTERVAL = 1000; // 1 second
const ERROR_CODE_NORMAL_CLOSE = 1000;

export default class LightningClient extends EventEmitter {
  constructor(pineAddress, mnemonic, config) {
    const { hostname } = parseAddress(pineAddress);

    super();

    this.config = config;
    this.baseUrl = resolveBaseUrl(hostname);
    this.keyPair = getKeyPairFromMnemonic(mnemonic);
    this.userId = getUserIdFromPublicKey(this.keyPair.publicKey);

    this.callCounter = 1;
    this.callbacks = {};
  }

  async connect() {
    this.disconnect();

    const { baseUrl } = this;
    const wsBaseUrl = baseUrl.replace(/http/, 'ws');
    const url = `${wsBaseUrl}/v1/lightning/ws`;
    const sessionId = await this._startSession();
    const authorizationHeader = this._getWebSocketAuthorizationHeader(sessionId);

    this.websocket = new WebSocket(url, authorizationHeader);

    this.websocket.addEventListener('open', this._onOpen.bind(this));
    this.websocket.addEventListener('close', this._onClose.bind(this));
    this.websocket.addEventListener('error', this._onError.bind(this));
    this.websocket.addEventListener('message', this._onMessage.bind(this));
  }

  disconnect() {
    const { websocket } = this;

    if (!websocket) {
      return;
    }

    websocket.close(ERROR_CODE_NORMAL_CLOSE);
    delete this.websocket;
  }

  sendRequest(methodName, request) {
    const callId = this.callCounter++;

    const data = serializeRequest({
      id: callId,
      method: methodName,
      request
    });

    return new Promise((resolve, reject) => {
      this.callbacks[callId] = (error, response) => {
        if (error) {
          return reject(error);
        }

        resolve(response);
      };

      this.websocket.send(data);
    });
  }

  sendResponse(callId, response, error) {
    this.websocket.send(serializeResponse({ id: callId, response, error }));
  }

  sendError(callId, error) {
    return this.sendResponse(callId, null, error);
  }

  openChannel(sats) {
    return this.sendRequest('openChannel', { sats });
  }

  closeChannel() {
    return this.sendRequest('closeChannel', {});
  }

  getBalance() {
    return this.sendRequest('getBalance', {});
  }

  sendPayment(paymentRequest) {
    return this.sendRequest('sendPayment', { paymentRequest });
  }

  createInvoice(amount) {
    return this.sendRequest('createInvoice', { amount });
  }

  _startSession() {
    const { baseUrl } = this;
    const endpoint = '/v1/lightning/sessions';
    const url = `${baseUrl}${endpoint}`;

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: this._getRestAuthorizationHeader(endpoint)
      }
    };

    return fetch(url, fetchOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then(error => {
          throw new Error(error.message);
        });
      })
      .then(response => {
        this.sessionId = response.sessionId;
        console.log('[LND] Started new session:', this.sessionId);
        return this.sessionId;
      });
  }

  _getRestAuthorizationHeader(endpoint) {
    const { userId, keyPair } = this;
    return getAuthorizationHeader(userId, endpoint, '', keyPair);
  }

  _getWebSocketAuthorizationHeader(sessionId) {
    const { keyPair } = this;
    return getAuthorizationHeader(sessionId, sessionId, '', keyPair);
  }

  _onOpen() {
    console.log('[LND] Connected');
    this._onPing();
  }

  _onClose({ code }) {
    clearTimeout(this._pingTimeout);

    if (code === ERROR_CODE_NORMAL_CLOSE) {
      return console.log('[LND] Disconnected');
    }

    // Try to reconnect.
    console.log('[LND] Reconnecting...');
    setTimeout(this.connect.bind(this), RECONNECT_INTERVAL);
  }

  _onError(error) {
    console.log('[LND] Error:', error.message);
    this.emit('error', error);
  }

  _onReady() {
    console.log('[LND] Ready');
    this.emit('ready');
  }

  _handleEventMessage(eventMessage) {
    const { event } = eventMessage;
    const data = eventMessage.data || {};
    let error;

    switch (event) {
      case 'error':
        error = new Error(data.message);
        error.name = data.name;
        return this._onError(error);

      case 'ready':
        return this._onReady();

      default:
        console.log(`[LND] Unknown event '${event}'`);
    }
  }

  _handleResponseMessage(responseMessage) {
    const { id, response, error } = responseMessage;
    const callback = this.callbacks[id];

    if (!callback) {
      console.log(`[LND] No callback found for call`);
      return; // No callback found for call.
    }

    if (error) {
      callback(new Error(error.message));
    } else {
      callback(null, response);
    }

    delete this.callbacks[id];
  }

  _handleRequestMessage(requestMessage) {
    const { id, method, request } = requestMessage;

    // TODO: Implement client methods.
    const error = new Error('Method not implemented');
    this._onError(error);
    return this.sendError(id, error);

    /*if (!methods[method]) {
      const error = new Error('Invalid method');
      this._onError(error);
      return this.sendError(id, error);
    }

    methods[method](request)
      .then(response => {
        this.sendResponse(id, response);
        this.emit('response', response);
      })
      .catch(error => {
        this.sendError(id, error);
        this._onError(error);
      });*/
  }

  _onMessage({ data }) {
    let deserializedMessage;

    if (data === 'ping') {
      return this._onPing();
    }

    try {
      deserializedMessage = deserializeClientMessage(data);
    } catch (error) {
      this._onError(error);
      return this.sendError(0, new Error('Malformed request'));
    }

    if (deserializedMessage.event) {
      return this._handleEventMessage(deserializedMessage);
    }

    if (deserializedMessage.response || deserializedMessage.error) {
      return this._handleResponseMessage(deserializedMessage);
    }

    return this._handleRequestMessage(deserializedMessage);
  }

  _onPing() {
    const { serverPingInterval } = this.config;

    // Respond with pong.
    this.websocket.send('pong');

    clearTimeout(this._pingTimeout);

    /**
     * Assume the connection is dead if no ping has been received within
     * the ping interval + some assumption of latency.
     */
    this._pingTimeout = setTimeout(() => {
      this.websocket.terminate();
    }, serverPingInterval * 1000 + PING_LATENCY);
  }
}
