import { get as getTransactions } from './get';

export const BITCOIN_API_TRANSACTIONS_GET_ALL_REQUEST = 'BITCOIN_API_TRANSACTIONS_GET_ALL_REQUEST';
export const BITCOIN_API_TRANSACTIONS_GET_ALL_SUCCESS = 'BITCOIN_API_TRANSACTIONS_GET_ALL_SUCCESS';
export const BITCOIN_API_TRANSACTIONS_GET_ALL_FAILURE = 'BITCOIN_API_TRANSACTIONS_GET_ALL_FAILURE';

const getAllRequest = () => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_ALL_REQUEST
  };
};

const getAllSuccess = (transactions) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_ALL_SUCCESS,
    transactions
  };
};

const getAllFailure = (error) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_ALL_FAILURE,
    error
  };
};

const mergeResult = (prevResult, newResult) => {
  if (!prevResult) {
    return newResult;
  }

  const merged = { ...prevResult };
  const keys = Object.keys(merged);

  keys.forEach((key) => {
    if (newResult[key]) {
      merged[key] = [...prevResult[key], ...newResult[key]];
    }
  });

  return merged;
};

const getAddressesWithTransactions = (transactions) => {
  const addresses = Object.keys(transactions);

  const filteredAddresses = addresses.filter((address) => {
    return transactions[address] && transactions[address].length;
  });

  return filteredAddresses;
};

const getTransactionsForAddresses = (dispatch, addresses, page = 1, result) => {
  return dispatch(getTransactions(addresses, page)).then((transactions) => {
    const newResult = mergeResult(result, transactions);
    const nextAddresses = getAddressesWithTransactions(transactions);
    const nextPage = page + 1;

    if (nextAddresses.length === 0) {
      return newResult;
    }

    return getTransactionsForAddresses(dispatch, nextAddresses, nextPage, newResult);
  });
};

export const getAll = (addresses) => {
  return (dispatch) => {
    dispatch(getAllRequest());

    return getTransactionsForAddresses(dispatch, addresses)
      .then((transactions) => {
        dispatch(getAllSuccess(transactions));
        return transactions;
      })
      .catch((error) => {
        dispatch(getAllFailure(error));
        throw error;
      });
  };
};
