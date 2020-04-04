import { getClient } from '../../clients/lightning';
import { getEstimate } from '../bitcoin/fees';

export const PINE_LIGHTNING_OPEN_CHANNEL_REQUEST = 'PINE_LIGHTNING_OPEN_CHANNEL_REQUEST';
export const PINE_LIGHTNING_OPEN_CHANNEL_SUCCESS = 'PINE_LIGHTNING_OPEN_CHANNEL_SUCCESS';
export const PINE_LIGHTNING_OPEN_CHANNEL_FAILURE = 'PINE_LIGHTNING_OPEN_CHANNEL_FAILURE';

const openChannelRequest = () => {
  return {
    type: PINE_LIGHTNING_OPEN_CHANNEL_REQUEST
  };
};

const openChannelSuccess = () => {
  return {
    type: PINE_LIGHTNING_OPEN_CHANNEL_SUCCESS
  };
};

const openChannelFailure = (error) => {
  return {
    type: PINE_LIGHTNING_OPEN_CHANNEL_FAILURE,
    error
  };
};

export const openChannel = (satsAmount) => {
  return async (dispatch) => {
    const client = getClient();

    dispatch(openChannelRequest());

    try {
      const satsPerByte = await dispatch(getEstimate());

      // TODO: The estimated fee is somehow too low and is rejected when broadcasted.
      await client.openChannel(satsAmount, satsPerByte * 10);
    } catch (error) {
      dispatch(openChannelFailure(error));
      throw error;
    }

    dispatch(openChannelSuccess());
  };
};
