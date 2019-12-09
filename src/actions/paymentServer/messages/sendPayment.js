import sendMessage from '../../../clients/paymentServer/user/messages/send';

export const PINE_MESSAGES_SEND_PAYMENT_REQUEST = 'PINE_MESSAGES_SEND_PAYMENT_REQUEST';
export const PINE_MESSAGES_SEND_PAYMENT_SUCCESS = 'PINE_MESSAGES_SEND_PAYMENT_SUCCESS';
export const PINE_MESSAGES_SEND_PAYMENT_FAILURE = 'PINE_MESSAGES_SEND_PAYMENT_FAILURE';

const MESSAGE_TYPE_PAYMENT = 'payment';

const sendPaymentRequest = () => {
  return {
    type: PINE_MESSAGES_SEND_PAYMENT_REQUEST
  };
};

const sendPaymentSuccess = (message) => {
  return {
    type: PINE_MESSAGES_SEND_PAYMENT_SUCCESS,
    message
  };
};

const sendPaymentFailure = (error) => {
  return {
    type: PINE_MESSAGES_SEND_PAYMENT_FAILURE,
    error
  };
};

/**
 * Action to send an end-to-end encrypted bitcoin transaction to a contact.
 *
 * The transaction must be serialized in raw format:
 * <https://bitcoin.org/en/developer-reference#raw-transaction-format>
 *
 * @param {string} transaction - Serialized and signed transaction in raw format.
 * @param {Object} contact - Contact to send the payment to.
 * @param {string} contact.address - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key.
 */
export const sendPayment = (transaction, contact) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;
    const network = `bitcoin_${state.settings.bitcoin.network}`;

    const paymentMessage = {
      version: 1,
      type: MESSAGE_TYPE_PAYMENT,
      data: {
        transaction,
        network
      }
    };

    dispatch(sendPaymentRequest());

    return sendMessage(paymentMessage, contact, credentials)
      .then((message) => {
        dispatch(sendPaymentSuccess(message));
        return message;
      })
      .catch((error) => {
        dispatch(sendPaymentFailure(error));
        throw error;
      });
  };
};
