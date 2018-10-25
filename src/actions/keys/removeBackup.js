import iCloudStorage from 'react-native-icloudstore';

export const KEYS_REMOVE_BACKUP_REQUEST = 'KEYS_REMOVE_BACKUP_REQUEST';
export const KEYS_REMOVE_BACKUP_SUCCESS = 'KEYS_REMOVE_BACKUP_SUCCESS';
export const KEYS_REMOVE_BACKUP_FAILURE = 'KEYS_REMOVE_BACKUP_FAILURE';

const ICLOUD_STORAGE_KEY = '@Mnemonic';

const removeBackupRequest = () => {
  return {
    type: KEYS_REMOVE_BACKUP_REQUEST
  };
};

const removeBackupSuccess = () => {
  return {
    type: KEYS_REMOVE_BACKUP_SUCCESS
  };
};

const removeBackupFailure = (error) => {
  return {
    type: KEYS_REMOVE_BACKUP_FAILURE,
    error
  };
};

export const removeBackup = () => {
  return (dispatch) => {
    dispatch(removeBackupRequest());

    return iCloudStorage.removeItem(ICLOUD_STORAGE_KEY)
      .then(() => {
        dispatch(removeBackupSuccess());
      })
      .catch((error) => {
        dispatch(removeBackupFailure(error));
        throw error;
      });
  };
};
