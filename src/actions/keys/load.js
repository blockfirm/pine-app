import { AsyncStorage } from 'react-native';

export const KEYS_LOAD_REQUEST = 'KEYS_LOAD_REQUEST';
export const KEYS_LOAD_SUCCESS = 'KEYS_LOAD_SUCCESS';
export const KEYS_LOAD_FAILURE = 'KEYS_LOAD_FAILURE';

const KEYS_STORAGE_KEY = '@Keys';

const loadRequest = () => {
  return {
    type: KEYS_LOAD_REQUEST
  };
};

const loadSuccess = (keys) => {
  return {
    type: KEYS_LOAD_SUCCESS,
    keys
  };
};

const loadFailure = (error) => {
  return {
    type: KEYS_LOAD_FAILURE,
    error
  };
};

export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(KEYS_STORAGE_KEY)
      .then((result) => {
        const keys = JSON.parse(result) || {};
        dispatch(loadSuccess(keys));
        return keys;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
