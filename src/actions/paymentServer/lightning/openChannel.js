import { getClient } from '../../../clients/lightning';
import { getEstimate } from '../../bitcoin/fees';

export const PINE_LIGHTNING_OPEN_CHANNEL_REQUEST = 'PINE_LIGHTNING_OPEN_CHANNEL_REQUEST';
export const PINE_LIGHTNING_OPEN_CHANNEL_SUCCESS = 'PINE_LIGHTNING_OPEN_CHANNEL_SUCCESS';
export const PINE_LIGHTNING_OPEN_CHANNEL_FAILURE = 'PINE_LIGHTNING_OPEN_CHANNEL_FAILURE';

const openChannelRequest = () => {
  return {
    type: PINE_LIGHTNING_OPEN_CHANNEL_REQUEST
  };
};

const openChannelSuccess = (fundingTransactionHash) => {
  return {
    type: PINE_LIGHTNING_OPEN_CHANNEL_SUCCESS,
    fundingTransactionHash
  };
};

const openChannelFailure = (error) => {
  return {
    type: PINE_LIGHTNING_OPEN_CHANNEL_FAILURE,
    error
  };
};

export const openChannel = (satsAmount) => {
  return (dispatch) => {
    console.log('LIGHTNING openChannel');
    const client = getClient();
    dispatch(openChannelRequest());

    return dispatch(getEstimate())
      .then((satsPerByte) => {
        // TODO: The estimated fee is somehow too low and is rejected when broadcasted.
        return client.openChannel(satsAmount, satsPerByte * 10);
      })
      .then((result) => {
        const fundingTransactionHash = result.funding_txid_bytes;
        dispatch(openChannelSuccess(fundingTransactionHash));
        return fundingTransactionHash;
      })
      .catch((error) => {
        dispatch(openChannelFailure(error));
        throw error;
      });
  };
};
