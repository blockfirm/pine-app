import iCloudStorage from 'react-native-icloudstore';

export const KEYS_BACKUP_REQUEST = 'KEYS_BACKUP_REQUEST';
export const KEYS_BACKUP_SUCCESS = 'KEYS_BACKUP_SUCCESS';
export const KEYS_BACKUP_FAILURE = 'KEYS_BACKUP_FAILURE';

const ICLOUD_STORAGE_KEY = '@Mnemonic';

const backupRequest = () => {
  return {
    type: KEYS_BACKUP_REQUEST
  };
};

const backupSuccess = () => {
  return {
    type: KEYS_BACKUP_SUCCESS
  };
};

const backupFailure = (error) => {
  return {
    type: KEYS_BACKUP_FAILURE,
    error
  };
};

export const backup = (mnemonic) => {
  return (dispatch) => {
    dispatch(backupRequest());

    if (!mnemonic) {
      const error = new Error('Cannot store an empty mnemonic.');
      dispatch(backupFailure(error));
      throw error;
    }

    return iCloudStorage.setItem(ICLOUD_STORAGE_KEY, mnemonic)
      .then(() => {
        dispatch(backupSuccess());
      })
      .catch((error) => {
        dispatch(backupFailure(error));
        throw error;
      });
  };
};
