import { getClient } from '../../clients/lightning';

export const PINE_LIGHTNING_SEND_PAYMENT_REQUEST = 'PINE_LIGHTNING_SEND_PAYMENT_REQUEST';
export const PINE_LIGHTNING_SEND_PAYMENT_SUCCESS = 'PINE_LIGHTNING_SEND_PAYMENT_SUCCESS';
export const PINE_LIGHTNING_SEND_PAYMENT_FAILURE = 'PINE_LIGHTNING_SEND_PAYMENT_FAILURE';

const sendPaymentRequest = () => {
  return {
    type: PINE_LIGHTNING_SEND_PAYMENT_REQUEST
  };
};

const sendPaymentSuccess = (paymentHash) => {
  return {
    type: PINE_LIGHTNING_SEND_PAYMENT_SUCCESS,
    paymentHash
  };
};

const sendPaymentFailure = (error) => {
  return {
    type: PINE_LIGHTNING_SEND_PAYMENT_FAILURE,
    error
  };
};

export const sendPayment = (paymentRequest) => {
  return (dispatch) => {
    const client = getClient();
    dispatch(sendPaymentRequest());

    return client.sendPayment(paymentRequest)
      .then(({ paymentHash }) => {
        dispatch(sendPaymentSuccess(paymentHash));
        return paymentHash;
      })
      .catch((error) => {
        dispatch(sendPaymentFailure(error));
        throw error;
      });
  };
};
