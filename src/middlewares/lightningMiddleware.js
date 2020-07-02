/* eslint-disable lines-around-comment */
import { beginBackgroundTask, endBackgroundTask } from 'react-native-begin-background-task';
import * as actions from '../actions';
import * as lightningRpcActions from '../actions/lightning/rpc';
import { LightningClient, setClient } from '../clients/lightning';

/**
 * Returns a map of lightning RPC client methods to redux implementations.
 */
const getMethods = (dispatch) => {
  const methods = {};

  Object.keys(lightningRpcActions).forEach(methodName => {
    methods[methodName] = (request) => dispatch(lightningRpcActions[methodName](request));
  });

  return methods;
};

const connectLightningClient = (client) => {
  /**
   * Start the connection in a background task for 10s in case
   * the app gets moved to the background before it's complete.
   */
  beginBackgroundTask().then(backgroundTaskId => {
    client.connect().catch(() => client.reconnect());

    setTimeout(() => {
      endBackgroundTask(backgroundTaskId);
    }, 10 * 1000);
  });
};

/**
 * This is a redux middleware that manages the Pine Lightning
 * client and integrates it with redux.
 */
const lightningMiddleware = () => {
  let client;

  // eslint-disable-next-line max-statements
  return store => next => action => {
    const state = store.getState();
    const { settings } = state;

    if (!settings || !settings.user || !settings.lightning.enabled) {
      return next(action);
    }

    const pineAddress = settings.user.profile.address;

    switch (action.type) {
      // Connect when app is ready.
      case actions.READY:
        if (!client) {
          client = new LightningClient(pineAddress, state.pine.credentials, settings.lightning);
          client.on('ready', () => store.dispatch(actions.sync({ force: true })));
          client.registerMethods(getMethods(store.dispatch));

          connectLightningClient(client);
          setClient(client);
        }
        break;

      // Disconnect when app is reset (user signed out).
      case actions.RESET_SUCCESS:
        if (client) {
          client.disconnect();
          client.removeAllListeners();
          client = null;

          setClient(client);
        }
        break;
    }

    return next(action);
  };
};

export default lightningMiddleware();
