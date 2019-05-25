import { getBackups } from './getBackups';

export const KEYS_RECOVER_REQUEST = 'KEYS_RECOVER_REQUEST';
export const KEYS_RECOVER_SUCCESS = 'KEYS_RECOVER_SUCCESS';
export const KEYS_RECOVER_FAILURE = 'KEYS_RECOVER_FAILURE';

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

export const recover = (pineAddress) => {
  return (dispatch) => {
    dispatch(recoverRequest());

    return dispatch(getBackups())
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
