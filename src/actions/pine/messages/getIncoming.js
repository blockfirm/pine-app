import getMessages from '../../../pineApi/user/messages/get';

export const PINE_MESSAGES_GET_REQUEST = 'PINE_MESSAGES_GET_REQUEST';
export const PINE_MESSAGES_GET_SUCCESS = 'PINE_MESSAGES_GET_SUCCESS';
export const PINE_MESSAGES_GET_FAILURE = 'PINE_MESSAGES_GET_FAILURE';

const getIncomingRequest = () => {
  return {
    type: PINE_MESSAGES_GET_REQUEST
  };
};

const getIncomingSuccess = (contacts) => {
  return {
    type: PINE_MESSAGES_GET_SUCCESS,
    contacts
  };
};

const getFailure = (error) => {
  return {
    type: PINE_MESSAGES_GET_FAILURE,
    error
  };
};

/**
 * Action to get all incoming messages from the user's Pine server.
 */
export const getIncoming = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(getIncomingRequest());

    return getMessages(credentials)
      .then((messages) => {
        dispatch(getIncomingSuccess(messages));
        return messages;
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
