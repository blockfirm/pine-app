import iCloudStorage from 'react-native-icloudstore';

export const KEYS_GET_BACKUPS_REQUEST = 'KEYS_GET_BACKUPS_REQUEST';
export const KEYS_GET_BACKUPS_SUCCESS = 'KEYS_GET_BACKUPS_SUCCESS';
export const KEYS_GET_BACKUPS_FAILURE = 'KEYS_GET_BACKUPS_FAILURE';

const ICLOUD_STORAGE_KEY = '@Mnemonic';

const getBackupsRequest = () => {
  return {
    type: KEYS_GET_BACKUPS_REQUEST
  };
};

const getBackupsSuccess = () => {
  return {
    type: KEYS_GET_BACKUPS_SUCCESS
  };
};

const getBackupsFailure = (error) => {
  return {
    type: KEYS_GET_BACKUPS_FAILURE,
    error
  };
};

const getExistingBackups = () => {
  return iCloudStorage.getItem(ICLOUD_STORAGE_KEY)
    .then((serializedBackups) => {
      if (!serializedBackups) {
        return [];
      }

      try {
        return JSON.parse(serializedBackups);
      } catch (error) {
        return [
          {
            mnemonic: serializedBackups,
            createdAt: Math.floor(Date.now() / 1000)
          }
        ];
      }
    });
};

export const getBackups = () => {
  return (dispatch) => {
    dispatch(getBackupsRequest());

    return getExistingBackups()
      .then((backups) => {
        dispatch(getBackupsSuccess());
        return backups;
      })
      .catch((error) => {
        dispatch(getBackupsFailure(error));
        throw error;
      });
  };
};
