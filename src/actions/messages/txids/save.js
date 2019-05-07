import { AsyncStorage } from 'react-native';

export const MESSAGES_TXIDS_SAVE_REQUEST = 'MESSAGES_TXIDS_SAVE_REQUEST';
export const MESSAGES_TXIDS_SAVE_SUCCESS = 'MESSAGES_TXIDS_SAVE_SUCCESS';
export const MESSAGES_TXIDS_SAVE_FAILURE = 'MESSAGES_TXIDS_SAVE_FAILURE';

const MESSAGES_TXIDS_STORAGE_KEY = '@Messages/TxIds';

const saveRequest = () => {
  return {
    type: MESSAGES_TXIDS_SAVE_REQUEST
  };
};

const saveSuccess = () => {
  return {
    type: MESSAGES_TXIDS_SAVE_SUCCESS
  };
};

const saveFailure = (error) => {
  return {
    type: MESSAGES_TXIDS_SAVE_FAILURE,
    error
  };
};

/**
 * Action to persist all message txids from state to AsyncStorage.
 */
export const save = () => {
  return (dispatch, getState) => {
    dispatch(saveRequest());

    const txids = getState().messages.txids;
    const serialized = JSON.stringify(txids);

    return AsyncStorage.setItem(MESSAGES_TXIDS_STORAGE_KEY, serialized)
      .then(() => {
        dispatch(saveSuccess());
      })
      .catch((error) => {
        dispatch(saveFailure(error));
        throw error;
      });
  };
};
