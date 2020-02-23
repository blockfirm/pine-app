import { getClient } from '../../clients/lightning';

export const PINE_LIGHTNING_CLOSE_CHANNEL_REQUEST = 'PINE_LIGHTNING_CLOSE_CHANNEL_REQUEST';
export const PINE_LIGHTNING_CLOSE_CHANNEL_SUCCESS = 'PINE_LIGHTNING_CLOSE_CHANNEL_SUCCESS';
export const PINE_LIGHTNING_CLOSE_CHANNEL_FAILURE = 'PINE_LIGHTNING_CLOSE_CHANNEL_FAILURE';

const closeChannelRequest = () => {
  return {
    type: PINE_LIGHTNING_CLOSE_CHANNEL_REQUEST
  };
};

const closeChannelSuccess = () => {
  return {
    type: PINE_LIGHTNING_CLOSE_CHANNEL_SUCCESS
  };
};

const closeChannelFailure = (error) => {
  return {
    type: PINE_LIGHTNING_CLOSE_CHANNEL_FAILURE,
    error
  };
};

export const closeChannel = () => {
  return async (dispatch) => {
    console.log('LIGHTNING closeChannel');
    const client = getClient();

    dispatch(closeChannelRequest());

    try {
      await client.closeChannel();
      dispatch(closeChannelSuccess());
    } catch (error) {
      dispatch(closeChannelFailure(error));
      throw error;
    }
  };
};
