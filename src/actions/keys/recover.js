import iCloudStorage from 'react-native-icloudstore';

export const KEYS_RECOVER_REQUEST = 'KEYS_RECOVER_REQUEST';
export const KEYS_RECOVER_SUCCESS = 'KEYS_RECOVER_SUCCESS';
export const KEYS_RECOVER_FAILURE = 'KEYS_RECOVER_FAILURE';

const ICLOUD_STORAGE_KEY = '@Mnemonic';

const recoverRequest = () => {
  return {
    type: KEYS_RECOVER_REQUEST
  };
};

const recoverSuccess = () => {
  return {
    type: KEYS_RECOVER_SUCCESS
  };
};

const recoverFailure = (error) => {
  return {
    type: KEYS_RECOVER_FAILURE,
    error
  };
};

export const recover = () => {
  return (dispatch) => {
    dispatch(recoverRequest());

    return iCloudStorage.getItem(ICLOUD_STORAGE_KEY)
      .then((mnemonic) => {
        dispatch(recoverSuccess());
        return mnemonic;
      })
      .catch((error) => {
        dispatch(recoverFailure(error));
        throw error;
      });
  };
};
