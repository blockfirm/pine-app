import * as api from '../../../api';

export const BITCOIN_FEES_GET_ESTIMATE_REQUEST = 'BITCOIN_FEES_GET_ESTIMATE_REQUEST';
export const BITCOIN_FEES_GET_ESTIMATE_SUCCESS = 'BITCOIN_FEES_GET_ESTIMATE_SUCCESS';
export const BITCOIN_FEES_GET_ESTIMATE_FAILURE = 'BITCOIN_FEES_GET_ESTIMATE_FAILURE';

const getEstimateRequest = () => {
  return {
    type: BITCOIN_FEES_GET_ESTIMATE_REQUEST
  };
};

const getEstimateSuccess = (satoshisPerByte) => {
  return {
    type: BITCOIN_FEES_GET_ESTIMATE_SUCCESS,
    satoshisPerByte
  };
};

const getEstimateFailure = (error) => {
  return {
    type: BITCOIN_FEES_GET_ESTIMATE_FAILURE,
    error
  };
};

/**
 * Action to get a transaction fee estimate.
 *
 * @param {number} numberOfBlocks - Number of blocks until confirmation. Defaults to 1.
 *
 * @returns {number} The estimated fee in satoshis per byte.
 */
export const getEstimate = (numberOfBlocks) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(getEstimateRequest());

    return api.bitcoin.fees.estimate.get(numberOfBlocks, options)
      .then((satoshisPerByte) => {
        dispatch(getEstimateSuccess(satoshisPerByte));
        return satoshisPerByte;
      })
      .catch((error) => {
        dispatch(getEstimateFailure(error));
        throw error;
      });
  };
};
