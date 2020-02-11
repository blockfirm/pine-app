import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../crypto/bitcoin/convert';

import { add as addInvoice } from '../lightning/invoices';
import { getInvoice, sendPayment } from '../paymentServer/lightning';
import { add as addMessage } from './add';

export const MESSAGES_SEND_LIGHTNING_PAYMENT_REQUEST = 'MESSAGES_SEND_LIGHTNING_PAYMENT_REQUEST';
export const MESSAGES_SEND_LIGHTNING_PAYMENT_SUCCESS = 'MESSAGES_SEND_LIGHTNING_PAYMENT_SUCCESS';
export const MESSAGES_SEND_LIGHTNING_PAYMENT_FAILURE = 'MESSAGES_SEND_LIGHTNING_PAYMENT_FAILURE';

const MESSAGE_TYPE_LIGHTNING_PAYMENT = 'lightning_payment';

const sendLightningPaymentRequest = () => {
  return {
    type: MESSAGES_SEND_LIGHTNING_PAYMENT_REQUEST
  };
};

const sendLightningPaymentSuccess = () => {
  return {
    type: MESSAGES_SEND_LIGHTNING_PAYMENT_SUCCESS
  };
};

const sendLightningPaymentFailure = (error) => {
  return {
    type: MESSAGES_SEND_LIGHTNING_PAYMENT_FAILURE,
    error
  };
};

const saveInvoice = (invoice, contact, dispatch) => {
  return dispatch(addInvoice([{
    ...invoice,
    payee: contact.address
  }]));
};

/**
 * Action to send a lightning payment to a contact.
 *
 * @param {Object} metadata - Metadata about the transaction.
 * @param {number} metadata.amountBtc - The amount in BTC of the transaction excluding fees.
 * @param {Object} contact - Contact to send the payment to.
 * @param {string} contact.id - The contact's local ID.
 * @param {string} contact.address - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key.
 *
 * @returns {Promise.{ message }} A promise that resolves when the payment has been sent and saved.
 */
export const sendLightningPayment = (metadata, contact) => {
  const { amountBtc } = metadata;
  const amountSats = convertBitcoin(amountBtc, UNIT_BTC, UNIT_SATOSHIS);

  const paymentMessage = {
    version: 1,
    type: MESSAGE_TYPE_LIGHTNING_PAYMENT,
    data: {}
  };

  return async (dispatch) => {
    dispatch(sendLightningPaymentRequest());

    try {
      // Get a lightning invoice from the contact's Pine server.
      const invoice = await dispatch(getInvoice(amountSats, paymentMessage, contact));

      // Save the invoice locally.
      await saveInvoice(invoice, contact, dispatch);

      // Pay the invoice.
      const paymentHash = await dispatch(sendPayment(invoice.paymentRequest));

      // Add message to conversation.
      const createdMessage = await dispatch(addMessage(contact.id, {
        ...paymentMessage,
        data: {
          ...paymentMessage.data,
          invoice,
          paymentHash
        },
        from: null,
        createdAt: Math.floor(Date.now() / 1000),
        amountBtc
      }));

      dispatch(sendLightningPaymentSuccess());

      return { message: createdMessage };
    } catch (error) {
      dispatch(sendLightningPaymentFailure(error));
      throw error;
    }
  };
};
