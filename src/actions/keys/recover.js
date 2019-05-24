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
          { mnemonic: serializedBackups }
        ];
      }
    });
};

export const recover = (pineAddress) => {
  return (dispatch) => {
    dispatch(recoverRequest());

    return getExistingBackups()
      .then((backups) => {
        if (backups.length === 0) {
          return;
        }

        if (!pineAddress) {
          return backups[0];
        }

        return backups.find((backup) => backup.pineAddress === pineAddress);
      })
      .then((backup) => {
        if (backup) {
          dispatch(recoverSuccess());
          return backup.mnemonic;
        }

        dispatch(recoverFailure());
      })
      .catch((error) => {
        dispatch(recoverFailure(error));
        throw error;
      });
  };
};
