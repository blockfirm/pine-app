import { AsyncStorage } from 'react-native';

export const BITCOIN_WALLET_UTXOS_LOAD_REQUEST = 'BITCOIN_WALLET_UTXOS_LOAD_REQUEST';
export const BITCOIN_WALLET_UTXOS_LOAD_SUCCESS = 'BITCOIN_WALLET_UTXOS_LOAD_SUCCESS';
export const BITCOIN_WALLET_UTXOS_LOAD_FAILURE = 'BITCOIN_WALLET_UTXOS_LOAD_FAILURE';

const BITCOIN_UTXOS_STORAGE_KEY = '@Bitcoin/Utxos';

const loadRequest = () => {
  return {
    type: BITCOIN_WALLET_UTXOS_LOAD_REQUEST
  };
};

const loadSuccess = (utxos) => {
  return {
    type: BITCOIN_WALLET_UTXOS_LOAD_SUCCESS,
    utxos
  };
};

const loadFailure = (error) => {
  return {
    type: BITCOIN_WALLET_UTXOS_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load the stored utxos into the state. Returns a promise that
 * resolves to the loaded utxos as an array.
 */
export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(BITCOIN_UTXOS_STORAGE_KEY)
      .then((result) => {
        const utxos = JSON.parse(result) || [];
        dispatch(loadSuccess(utxos));
        return utxos;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
