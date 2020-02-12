import uuidv4 from 'uuid/v4';
import * as bolt11 from 'bolt11';

import { sendPayment } from '../lightning';
import { addLightning as addLightningContact } from '../contacts';
import { add as addMessage } from './add';

export const MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_REQUEST = 'MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_REQUEST';
export const MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_SUCCESS = 'MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_SUCCESS';
export const MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_FAILURE = 'MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_FAILURE';

const sendLegacyLightningPaymentRequest = () => {
  return {
    type: MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_REQUEST
  };
};

const sendLegacyLightningPaymentSuccess = () => {
  return {
    type: MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_SUCCESS
  };
};

const sendLegacyLightningPaymentFailure = (error) => {
  return {
    type: MESSAGES_SEND_LEGACY_LIGHTNING_PAYMENT_FAILURE,
    error
  };
};

/**
 * Action to send a lightning transaction using a payment request.
 *
 * The payment request must be in BOLT11 format:
 * <https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md>
 *
 * @param {string} paymentRequest - BOLT11 payment request to pay.
 * @param {Object} metadata - Metadata about the transaction.
 * @param {number} metadata.amountBtc - The amount in BTC of the transaction excluding fees.
 * @param {Object} [contact] - Contact the payment is for. One will be created if not specified.
 * @param {string} contact.id - The contact's ID.
 *
 * @returns {Promise.{ message, createdContact }} A promise that resolves when the payment has sent.
 */
export const sendLegacyLightningPayment = (paymentRequest, metadata, contact = null) => {
  const decodedPaymentRequest = bolt11.decode(paymentRequest);
  const lightningNodeKey = decodedPaymentRequest.payeeNodeKey;
  const { amountBtc } = metadata;
  let createdContact;
  let createdMessage;

  return (dispatch) => {
    dispatch(sendLegacyLightningPaymentRequest());

    return Promise.resolve()
      .then(() => {
        // Send lightning payment.
        return dispatch(sendPayment(paymentRequest));
      })
      .then(() => {
        // Add as lightning contact if not already added.
        if (!contact) {
          return dispatch(addLightningContact({ lightningNodeKey })).then((addedContact) => {
            createdContact = addedContact;
            return createdContact;
          });
        }

        return contact;
      })
      .then(async (lightningContact) => {
        const message = {
          id: uuidv4(),
          type: 'lightning_payment',
          from: null,
          createdAt: Math.floor(Date.now() / 1000),
          data: { paymentRequest },
          amountBtc
        };

        // Add message to the created contact/conversation.
        createdMessage = await dispatch(addMessage(lightningContact.id, message));
      })
      .then(() => {
        dispatch(sendLegacyLightningPaymentSuccess());

        return {
          message: createdMessage,
          createdContact
        };
      })
      .catch((error) => {
        dispatch(sendLegacyLightningPaymentFailure(error));
        throw error;
      });
  };
};
