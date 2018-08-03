import { AsyncStorage } from 'react-native';
import {
  save as saveTransactions,
  BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST,
  BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS,
  BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/transactions/save';

const BITCOIN_TRANSACTIONS_STORAGE_KEY = '@Bitcoin/Transactions';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  bitcoin: {
    wallet: {
      transactions: {
        items: [
          { txid: '9e1ccb8b-5fe6-4463-9993-d14ff67e7fb4' },
          { txid: '1262acab-ee79-4a71-b7e6-5643edb3e25d' }
        ]
      }
    }
  }
}));

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => Promise.resolve())
  }
}));

describe('BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST).toBe('BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS).toBe('BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE).toBe('BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE');
  });
});

describe('save', () => {
  beforeEach(() => {
    AsyncStorage.setItem.mockClear();
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof saveTransactions).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(saveTransactions.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = saveTransactions();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST', () => {
    saveTransactions()(dispatchMock, getStateMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST
    });
  });

  it('calls getState() to get the transactions from the state', () => {
    expect.hasAssertions();

    return saveTransactions()(dispatchMock, getStateMock).then(() => {
      expect(getStateMock).toHaveBeenCalledTimes(1);
    });
  });

  it('serializes the transactions and saves it to AsyncStorage', () => {
    expect.hasAssertions();

    return saveTransactions()(dispatchMock, getStateMock).then(() => {
      const argument1 = AsyncStorage.setItem.mock.calls[0][0];
      const argument2 = AsyncStorage.setItem.mock.calls[0][1];
      const deserializedArgument2 = JSON.parse(argument2);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(argument1).toBe(BITCOIN_TRANSACTIONS_STORAGE_KEY);

      expect(typeof deserializedArgument2).toBe('object');
      expect(deserializedArgument2[0].txid).toBe('9e1ccb8b-5fe6-4463-9993-d14ff67e7fb4');
      expect(deserializedArgument2[1].txid).toBe('1262acab-ee79-4a71-b7e6-5643edb3e25d');
    });
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS', () => {
    expect.hasAssertions();

    return saveTransactions()(dispatchMock, getStateMock).then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from AsyncStorage.setItem().
      AsyncStorage.setItem.mockImplementationOnce(() => Promise.reject(
        new Error('47ccef69-0e11-41fc-9105-a3aefe33bed2')
      ));

      promise = saveTransactions()(dispatchMock, getStateMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('47ccef69-0e11-41fc-9105-a3aefe33bed2');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE,
          error
        });
      });
    });
  });
});
