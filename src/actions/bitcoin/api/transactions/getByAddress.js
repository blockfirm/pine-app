import { get as getTransactions } from './get';

export const BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST = 'BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST';
export const BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS = 'BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS';
export const BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE = 'BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE';

const getByAddressRequest = () => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST
  };
};

const getByAddressSuccess = (transactions) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS,
    transactions
  };
};

const getByAddressFailure = (error) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE,
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

export const getByAddress = (addresses) => {
  return (dispatch) => {
    dispatch(getByAddressRequest());

    return getTransactionsForAddresses(dispatch, addresses)
      .then((transactions) => {
        dispatch(getByAddressSuccess(transactions));
        return transactions;
      })
      .catch((error) => {
        dispatch(getByAddressFailure(error));
        throw error;
      });
  };
};
