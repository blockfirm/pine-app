import { AsyncStorage } from 'react-native';
import {
  load as loadTransactions,
  BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST,
  BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS,
  BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/transactions/load';

const BITCOIN_TRANSACTIONS_STORAGE_KEY = '@Bitcoin/Transactions';
const dispatchMock = jest.fn();

jest.mock('react-native', () => ({
  AsyncStorage: {
    getItem: jest.fn(() => Promise.resolve(
      '[ { "txid": "507d3353-dae4-4107-982b-92f7202cdee8" } ]'
    ))
  }
}));

describe('BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST).toBe('BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS).toBe('BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE).toBe('BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE');
  });
});

describe('load', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof loadTransactions).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(loadTransactions.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = loadTransactions();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST', () => {
    loadTransactions()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST
    });
  });

  it('gets the transactions from AsyncStorage', () => {
    expect.hasAssertions();

    return loadTransactions()(dispatchMock).then(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(BITCOIN_TRANSACTIONS_STORAGE_KEY);
    });
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS with the transactions', () => {
    expect.hasAssertions();

    return loadTransactions()(dispatchMock).then((transactions) => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS,
        transactions
      });
    });
  });

  describe('the resolved value', () => {
    let transactions;

    beforeEach(() => {
      return loadTransactions()(dispatchMock).then((result) => {
        transactions = result;
      });
    });

    it('is an array that is deserialized from AsyncStorage', () => {
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions).toBeTruthy();

      // This value comes from the mock of AsyncStorage.getItem().
      expect(transactions[0].txid).toBe('507d3353-dae4-4107-982b-92f7202cdee8');
    });
  });

  describe('when there are no transactions', () => {
    it('resolves to an empty array', () => {
      expect.hasAssertions();

      // Make the AsyncStorage.getItem() mock return a promise that resolves to null.
      AsyncStorage.getItem.mockImplementationOnce(() => Promise.resolve(null));

      return loadTransactions()(dispatchMock).then((transactions) => {
        expect(transactions).toBeTruthy();
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBe(0);
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from AsyncStorage.getItem().
      AsyncStorage.getItem.mockImplementationOnce(() => Promise.reject(
        new Error('65c52de9-4bc6-41bb-a00a-4d30ae98a936')
      ));

      promise = loadTransactions()(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('65c52de9-4bc6-41bb-a00a-4d30ae98a936');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE,
          error
        });
      });
    });
  });
});
