import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../crypto/bitcoin/convert';

import { reserve as reserveUtxos } from '../bitcoin/wallet/utxos';
import { sendPayment as sendPaymentToServer } from '../pine/messages/sendPayment';
import { add as addMessage } from './add';

export const MESSAGES_SEND_PAYMENT_REQUEST = 'MESSAGES_SEND_PAYMENT_REQUEST';
export const MESSAGES_SEND_PAYMENT_SUCCESS = 'MESSAGES_SEND_PAYMENT_SUCCESS';
export const MESSAGES_SEND_PAYMENT_FAILURE = 'MESSAGES_SEND_PAYMENT_FAILURE';

const sendPaymentRequest = () => {
  return {
    type: MESSAGES_SEND_PAYMENT_REQUEST
  };
};

const sendPaymentSuccess = () => {
  return {
    type: MESSAGES_SEND_PAYMENT_SUCCESS
  };
};

const sendPaymentFailure = (error) => {
  return {
    type: MESSAGES_SEND_PAYMENT_FAILURE,
    error
  };
};

/**
 * Action to send an end-to-end encrypted bitcoin transaction to a contact.
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
 * @param {Object[]} metadata.inputs - Inputs that was used to build the transaction (returned by the createTransaction action).
 * @param {Object} contact - Contact to send the payment to.
 * @param {string} contact.address - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key.
 *
 * @returns {Promise} A promise that resolves when the payment has been sent and saved.
 */
export const sendPayment = (rawTransaction, metadata, contact) => {
  const { txid, address, amountBtc, fee, inputs } = metadata;
  const feeBtc = fee ? convertBitcoin(fee, UNIT_SATOSHIS, UNIT_BTC) : 0;

  return (dispatch) => {
    dispatch(sendPaymentRequest());

    // Send payment as a message to the contact's Pine server.
    return dispatch(sendPaymentToServer(rawTransaction, contact))
      .then((sentMessage) => {
        const message = {
          id: sentMessage.id,
          type: 'payment',
          from: null,
          address: { address },
          createdAt: sentMessage.createdAt,
          data: { transaction: rawTransaction },
          txid,
          amountBtc,
          feeBtc
        };

        // Add message to conversation.
        return dispatch(addMessage(contact.id, message));
      })
      .then(() => {
        // Reserve UTXOs.
        const amountToReserve = amountBtc + feeBtc;

        const utxosToReserve = inputs.map((input) => ({
          txid: input.txid,
          index: input.vout
        }));

        return dispatch(reserveUtxos(utxosToReserve, amountToReserve));
      })
      .then(() => {
        dispatch(sendPaymentSuccess());
      })
      .catch((error) => {
        dispatch(sendPaymentFailure(error));
        throw error;
      });
  };
};
