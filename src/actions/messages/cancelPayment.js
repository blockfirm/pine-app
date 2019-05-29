import bitcoin from 'bitcoinjs-lib';
import { cancelReservations as cancelUtxoReservations } from '../bitcoin/wallet/utxos';
import { remove as removeMessageFromServer } from '../pine/messages/remove';
import { save } from './save';

export const MESSAGES_CANCEL_PAYMENT_REQUEST = 'MESSAGES_CANCEL_PAYMENT_REQUEST';
export const MESSAGES_CANCEL_PAYMENT_SUCCESS = 'MESSAGES_CANCEL_PAYMENT_SUCCESS';
export const MESSAGES_CANCEL_PAYMENT_FAILURE = 'MESSAGES_CANCEL_PAYMENT_FAILURE';

const cancelPaymentRequest = () => {
  return {
    type: MESSAGES_CANCEL_PAYMENT_REQUEST
  };
};

const cancelPaymentSuccess = (messageId, contactId) => {
  return {
    type: MESSAGES_CANCEL_PAYMENT_SUCCESS,
    messageId,
    contactId
  };
};

const cancelPaymentFailure = (error) => {
  return {
    type: MESSAGES_CANCEL_PAYMENT_FAILURE,
    error
  };
};

/**
 * Action to cancel a payment. This does not invalidate the payment – it just removes the payment
 * from the recipient's server and releases the reserved funds. To truly invalidate this payment,
 * a new transaction has to be made that spends one of the same UTXOs.
 *
 * @param {Object} message - Payment message to cancel.
 * @param {string} message.id - ID of the message.
 * @param {Object} message.data - Message data.
 * @param {string} message.data.transaction - Raw serialized bitcoin transaction.
 * @param {Object} contact - Contact the message was sent to.
 * @param {string} contact.id - ID of the contact.
 * @param {string} contact.address - Pine address of the contact.
 * @param {string} contact.userId - User ID of the contact.
 *
 * @returns {Promise} A promise that resolves when the payment has been canceled.
 */
export const cancelPayment = (message, contact) => {
  return (dispatch) => {
    dispatch(cancelPaymentRequest());

    const rawTransaction = message.data.transaction;
    const transaction = bitcoin.Transaction.fromHex(rawTransaction);

    const utxos = transaction.ins.map((input) => {
      const txid = Buffer.from(input.hash).reverse().toString('hex');
      const index = input.index;

      return { txid, index };
    });

    return dispatch(cancelUtxoReservations(utxos))
      .then(() => {
        return dispatch(removeMessageFromServer(message, contact))
          .catch((error) => {
            // Suppress error when message was not found on server.
            if (!error.message.includes('not found')) {
              throw error;
            }
          });
      })
      .then(() => {
        /**
         * The message is flagged as canceled by the reducer.
         * So save the state after the action, not before.
         */
        dispatch(cancelPaymentSuccess(message.id, contact.id));
        return dispatch(save(contact.id));
      })
      .catch((error) => {
        dispatch(cancelPaymentFailure(error));
        throw error;
      });
  };
};
