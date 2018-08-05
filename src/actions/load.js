import { load as loadBitcoinWallet } from './bitcoin/wallet';
import { load as loadKeys } from './keys';
import { load as loadSettings } from './settings';

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
      dispatch(loadBitcoinWallet())
    ];

    return Promise.all(promises)
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
