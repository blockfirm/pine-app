import { getClient } from '../../clients/lightning';

export const PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_REQUEST = 'PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_REQUEST';
export const PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_SUCCESS = 'PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_SUCCESS';
export const PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_FAILURE = 'PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_FAILURE';

const openInboundChannelRequest = () => {
  return {
    type: PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_REQUEST
  };
};

const openInboundChannelSuccess = () => {
  return {
    type: PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_SUCCESS
  };
};

const openInboundChannelFailure = (error) => {
  return {
    type: PINE_LIGHTNING_OPEN_INBOUND_CHANNEL_FAILURE,
    error
  };
};

export const openInboundChannel = () => {
  return async (dispatch) => {
    const client = getClient();

    dispatch(openInboundChannelRequest());

    try {
      await client.openInboundChannel();
    } catch (error) {
      dispatch(openInboundChannelFailure(error));
      throw error;
    }

    dispatch(openInboundChannelSuccess());
  };
};
