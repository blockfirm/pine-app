import AsyncStorage from '@react-native-community/async-storage';

export const BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST = 'BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST';
export const BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS = 'BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS';
export const BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE = 'BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE';

const BITCOIN_TRANSACTIONS_STORAGE_KEY = '@Bitcoin/Transactions';

const loadRequest = () => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST
  };
};

const loadSuccess = (transactions) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS,
    transactions
  };
};

const loadFailure = (error) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load persisted transactions into state. Returns a promise that
 * resolves to the loaded transactions as an array.
 */
export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(BITCOIN_TRANSACTIONS_STORAGE_KEY)
      .then((result) => {
        const transactions = JSON.parse(result) || [];
        dispatch(loadSuccess(transactions));
        return transactions;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
