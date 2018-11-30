import * as api from '../../../api';

export const BITCOIN_FEES_GET_ESTIMATE_REQUEST = 'BITCOIN_FEES_GET_ESTIMATE_REQUEST';
export const BITCOIN_FEES_GET_ESTIMATE_SUCCESS = 'BITCOIN_FEES_GET_ESTIMATE_SUCCESS';
export const BITCOIN_FEES_GET_ESTIMATE_FAILURE = 'BITCOIN_FEES_GET_ESTIMATE_FAILURE';

export const FEE_LEVEL_HIGH = 'high';
export const FEE_LEVEL_NORMAL = 'normal';
export const FEE_LEVEL_LOW = 'low';
export const FEE_LEVEL_VERY_LOW = 'very low';
export const FEE_LEVEL_CUSTOM = 'custom';

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
 * Adjusts a fee rate according to the preferred fee level.
 */
export const adjustFeeRate = (satoshisPerByte, feeLevel) => {
  switch (feeLevel.toLowerCase()) {
    case FEE_LEVEL_HIGH:
      return satoshisPerByte * 1.5; // 150%

    case FEE_LEVEL_LOW:
      return satoshisPerByte * 0.5; // 50%

    case FEE_LEVEL_VERY_LOW:
      return satoshisPerByte * 0.25; // 25%

    case FEE_LEVEL_NORMAL:
    default:
      return satoshisPerByte; // 100%
  }
};

/**
 * Action to get a transaction fee rate estimate.
 *
 * @param {number} numberOfBlocks - Number of blocks until confirmation. Defaults to 1.
 * @param {boolean} ignoreFeeLevel - Whether or not to ignore the fee level settings. Defaults to false.
 *
 * @returns {number} The estimated fee rate in satoshis per byte.
 */
export const getEstimate = (numberOfBlocks = 1, ignoreFeeLevel) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const feeSettings = settings.bitcoin.fee;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(getEstimateRequest());

    // Return fee directly if it's set to custom.
    if (!ignoreFeeLevel && feeSettings.level.toLowerCase() === FEE_LEVEL_CUSTOM) {
      const satoshisPerByte = parseFloat(feeSettings.satoshisPerByte);
      dispatch(getEstimateSuccess(satoshisPerByte));
      return Promise.resolve(satoshisPerByte);
    }

    return api.bitcoin.fees.estimate.get(numberOfBlocks, options)
      .then((satoshisPerByte) => {
        if (ignoreFeeLevel) {
          dispatch(getEstimateSuccess(satoshisPerByte));
          return satoshisPerByte;
        }

        // Adjust fee rate according to settings before returning.
        const adjustedFeeRate = adjustFeeRate(satoshisPerByte, feeSettings.level);
        dispatch(getEstimateSuccess(adjustedFeeRate));
        return adjustedFeeRate;
      })
      .catch((error) => {
        dispatch(getEstimateFailure(error));
        throw error;
      });
  };
};
