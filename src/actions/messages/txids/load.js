import { AsyncStorage } from 'react-native';

export const MESSAGES_TXIDS_LOAD_REQUEST = 'MESSAGES_TXIDS_LOAD_REQUEST';
export const MESSAGES_TXIDS_LOAD_SUCCESS = 'MESSAGES_TXIDS_LOAD_SUCCESS';
export const MESSAGES_TXIDS_LOAD_FAILURE = 'MESSAGES_TXIDS_LOAD_FAILURE';

const MESSAGES_TXIDS_STORAGE_KEY = '@Messages/TxIds';

const loadRequest = () => {
  return {
    type: MESSAGES_TXIDS_LOAD_REQUEST
  };
};

const loadSuccess = (txids) => {
  return {
    type: MESSAGES_TXIDS_LOAD_SUCCESS,
    txids
  };
};

const loadFailure = (error) => {
  return {
    type: MESSAGES_TXIDS_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load message txids from persistent storage into state.
 *
 * @returns {Promise.Object} A promise that resolves to a map of txids.
 */
export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(MESSAGES_TXIDS_STORAGE_KEY)
      .then((result) => {
        const txids = JSON.parse(result) || {};
        dispatch(loadSuccess(txids));
        return txids;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
