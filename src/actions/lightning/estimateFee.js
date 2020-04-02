import { getClient } from '../../clients/lightning';

export const PINE_LIGHTNING_ESTIMATE_FEE_REQUEST = 'PINE_LIGHTNING_ESTIMATE_FEE_REQUEST';
export const PINE_LIGHTNING_ESTIMATE_FEE_SUCCESS = 'PINE_LIGHTNING_ESTIMATE_FEE_SUCCESS';
export const PINE_LIGHTNING_ESTIMATE_FEE_FAILURE = 'PINE_LIGHTNING_ESTIMATE_FEE_FAILURE';

const estimateFeeRequest = () => {
  return {
    type: PINE_LIGHTNING_ESTIMATE_FEE_REQUEST
  };
};

const estimateFeeSuccess = (low, high) => {
  return {
    type: PINE_LIGHTNING_ESTIMATE_FEE_SUCCESS,
    low,
    high
  };
};

const estimateFeeFailure = (error) => {
  return {
    type: PINE_LIGHTNING_ESTIMATE_FEE_FAILURE,
    error
  };
};

export const estimateFee = (paymentRequest) => {
  return (dispatch) => {
    const client = getClient();
    dispatch(estimateFeeRequest());

    return client.estimateFee(paymentRequest)
      .then(fees => {
        const low = parseInt(fees.low);
        const high = parseInt(fees.high);

        dispatch(estimateFeeSuccess(low, high));

        return { low, high };
      })
      .catch(error => {
        dispatch(estimateFeeFailure(error));
        throw error;
      });
  };
};
