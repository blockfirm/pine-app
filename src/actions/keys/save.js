import AsyncStorage from '@react-native-community/async-storage';

export const KEYS_SAVE_REQUEST = 'KEYS_SAVE_REQUEST';
export const KEYS_SAVE_SUCCESS = 'KEYS_SAVE_SUCCESS';
export const KEYS_SAVE_FAILURE = 'KEYS_SAVE_FAILURE';

const KEYS_STORAGE_KEY = '@Keys';

const saveRequest = () => {
  return {
    type: KEYS_SAVE_REQUEST
  };
};

const saveSuccess = () => {
  return {
    type: KEYS_SAVE_SUCCESS
  };
};

const saveFailure = (error) => {
  return {
    type: KEYS_SAVE_FAILURE,
    error
  };
};

export const save = () => {
  return (dispatch, getState) => {
    dispatch(saveRequest());

    const items = getState().keys.items;
    const serialized = JSON.stringify(items);

    return AsyncStorage.setItem(KEYS_STORAGE_KEY, serialized)
      .then(() => {
        dispatch(saveSuccess());
      })
      .catch((error) => {
        dispatch(saveFailure(error));
        throw error;
      });
  };
};
