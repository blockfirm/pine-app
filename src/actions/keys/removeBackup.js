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

export const removeBackup = (pineAddress) => {
  return (dispatch) => {
    dispatch(removeBackupRequest());

    return getExistingBackups()
      .then((backups) => {
        const otherBackups = backups.filter((backup) => {
          return backup.pineAddress !== pineAddress;
        });

        return iCloudStorage.setItem(ICLOUD_STORAGE_KEY, JSON.stringify(otherBackups));
      })
      .then(() => {
        dispatch(removeBackupSuccess());
      })
      .catch((error) => {
        dispatch(removeBackupFailure(error));
        throw error;
      });
  };
};
