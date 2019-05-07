import uuidv4 from 'uuid/v4';

import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../crypto/bitcoin/convert';

import { post as postTransaction } from '../bitcoin/blockchain/transactions';
import { addLegacy as addLegacyContact } from '../contacts';
import { add as addMessage } from './add';

export const MESSAGES_SEND_LEGACY_PAYMENT_REQUEST = 'MESSAGES_SEND_LEGACY_PAYMENT_REQUEST';
export const MESSAGES_SEND_LEGACY_PAYMENT_SUCCESS = 'MESSAGES_SEND_LEGACY_PAYMENT_SUCCESS';
export const MESSAGES_SEND_LEGACY_PAYMENT_FAILURE = 'MESSAGES_SEND_LEGACY_PAYMENT_FAILURE';

const sendLegacyPaymentRequest = () => {
  return {
    type: MESSAGES_SEND_LEGACY_PAYMENT_REQUEST
  };
};

const sendLegacyPaymentSuccess = () => {
  return {
    type: MESSAGES_SEND_LEGACY_PAYMENT_SUCCESS
  };
};

const sendLegacyPaymentFailure = (error) => {
  return {
    type: MESSAGES_SEND_LEGACY_PAYMENT_FAILURE,
    error
  };
};

/**
 * Action to send a bitcoin transaction to a bitcoin address.
 *
 * The transaction must be serialized in raw format:
 * <https://bitcoin.org/en/developer-reference#raw-transaction-format>
 *
 * @param {string} rawTransaction - Serialized and signed transaction in raw format.
 * @param {Object} metadata - Metadata about the transaction.
 * @param {string} metadata.txid - The transaction's ID (hash).
 * @param {string} metadata.address - Bitcoin address the transaction is paying to.
 * @param {number} metadata.amountBtc - The amount in BTC of the transaction excluding fees.
 * @param {number} metadata.fee - The transaction fee in satoshis.
 * @param {Object} [contact] - Contact the payment is for. One will be created if not specified.
 * @param {string} contact.id - The contact's ID.
 *
 * @returns {Promise.{ message, createdContact }} A promise that resolves when the payment has been broadcasted.
 */
export const sendLegacyPayment = (rawTransaction, metadata, contact = null) => {
  const { txid, address, amountBtc, fee } = metadata;
  const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;
  let createdContact;
  let createdMessage;

  return (dispatch) => {
    dispatch(sendLegacyPaymentRequest());

    return Promise.resolve()
      .then(() => {
        // Add as legacy contact if not already added.
        if (!contact) {
          return dispatch(addLegacyContact({ address })).then((addedContact) => {
            createdContact = addedContact;
            return createdContact;
          });
        }

        return contact;
      })
      .then((bitcoinContact) => {
        const message = {
          id: uuidv4(),
          type: 'payment',
          from: null,
          address: { address },
          createdAt: Math.floor(Date.now() / 1000),
          data: { transaction: rawTransaction },
          txid,
          amountBtc,
          feeBtc
        };

        // Save message to conversation.
        return dispatch(addMessage(bitcoinContact.id, message)).then((addedMessage) => {
          createdMessage = addedMessage;
        });
      })
      .then(() => {
        // Broadcast transaction.
        return dispatch(postTransaction(rawTransaction));
      })
      .then(() => {
        dispatch(sendLegacyPaymentSuccess());

        return {
          message: createdMessage,
          createdContact
        };
      })
      .catch((error) => {
        dispatch(sendLegacyPaymentFailure(error));
        throw error;
      });
  };
};
