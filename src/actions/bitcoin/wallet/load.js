import { load as loadExternalAddresses } from './addresses/external';
import { load as loadInternalAddresses } from './addresses/internal';
import { load as loadTransactions } from './transactions';

export const BITCOIN_WALLET_LOAD_REQUEST = 'BITCOIN_WALLET_LOAD_REQUEST';
export const BITCOIN_WALLET_LOAD_SUCCESS = 'BITCOIN_WALLET_LOAD_SUCCESS';
export const BITCOIN_WALLET_LOAD_FAILURE = 'BITCOIN_WALLET_LOAD_FAILURE';

const loadRequest = () => {
  return {
    type: BITCOIN_WALLET_LOAD_REQUEST
  };
};

const loadSuccess = () => {
  return {
    type: BITCOIN_WALLET_LOAD_SUCCESS
  };
};

const loadFailure = (error) => {
  return {
    type: BITCOIN_WALLET_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load the bitcoin wallet from persistent storage
 * into state.
 */
export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    const promises = [
      dispatch(loadExternalAddresses()),
      dispatch(loadInternalAddresses()),
      dispatch(loadTransactions())
    ];

    return Promise.all(promises)
      .then(() => {
        dispatch(loadSuccess());
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
