import { load as loadBitcoinWallet } from './bitcoin/wallet';
import { load as loadKeys } from './keys';
import { load as loadSettings } from './settings';
import { load as loadContacts } from './contacts';
import { load as loadPineCredentials } from './pine/credentials';

export const LOAD_REQUEST = 'LOAD_REQUEST';
export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const LOAD_FAILURE = 'LOAD_FAILURE';

const loadRequest = () => {
  return {
    type: LOAD_REQUEST
  };
};

const loadSuccess = () => {
  return {
    type: LOAD_SUCCESS
  };
};

const loadFailure = (error) => {
  return {
    type: LOAD_FAILURE,
    error
  };
};

/**
 * Action to load everything from persistent storage into state.
 */
export const load = () => {
  return (dispatch, getState) => {
    dispatch(loadRequest());

    const promises = [
      dispatch(loadSettings()),
      dispatch(loadKeys()),
      dispatch(loadContacts()),
      dispatch(loadBitcoinWallet())
    ];

    return Promise.all(promises)
      .then(() => {
        // Pine credentials can only be loaded once the keys has loaded.
        return dispatch(loadPineCredentials());
      })
      .then(() => {
        const state = getState();
        dispatch(loadSuccess());
        return state;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
