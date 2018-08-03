import { AsyncStorage } from 'react-native';
import {
  save as saveAddresses,
  BITCOIN_WALLET_ADDRESSES_SAVE_REQUEST,
  BITCOIN_WALLET_ADDRESSES_SAVE_SUCCESS,
  BITCOIN_WALLET_ADDRESSES_SAVE_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/addresses/save';

const BITCOIN_ADDRESSES_STORAGE_KEY = '@Bitcoin/Addresses';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  bitcoin: {
    wallet: {
      addresses: {
        items: {
          '353128ef-a7bd-44f0-8a60-5c93c04e1c2e': {},
          '7c7c78c9-2d23-4c4c-9135-1f09f113d87b': {}
        }
      }
    }
  }
}));

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => Promise.resolve())
  }
}));

describe('BITCOIN_WALLET_ADDRESSES_SAVE_REQUEST', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_SAVE_REQUEST"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_SAVE_REQUEST).toBe('BITCOIN_WALLET_ADDRESSES_SAVE_REQUEST');
  });
});

describe('BITCOIN_WALLET_ADDRESSES_SAVE_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_SAVE_SUCCESS"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_SAVE_SUCCESS).toBe('BITCOIN_WALLET_ADDRESSES_SAVE_SUCCESS');
  });
});

describe('BITCOIN_WALLET_ADDRESSES_SAVE_FAILURE', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_SAVE_FAILURE"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_SAVE_FAILURE).toBe('BITCOIN_WALLET_ADDRESSES_SAVE_FAILURE');
  });
});

describe('save', () => {
  beforeEach(() => {
    AsyncStorage.setItem.mockClear();
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof saveAddresses).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(saveAddresses.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = saveAddresses();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_SAVE_REQUEST', () => {
    saveAddresses()(dispatchMock, getStateMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_ADDRESSES_SAVE_REQUEST
    });
  });

  it('calls getState() to get the addresses from the state', () => {
    expect.hasAssertions();

    return saveAddresses()(dispatchMock, getStateMock).then(() => {
      expect(getStateMock).toHaveBeenCalledTimes(1);
    });
  });

  it('serializes the addresses and saves it to AsyncStorage', () => {
    expect.hasAssertions();

    return saveAddresses()(dispatchMock, getStateMock).then(() => {
      const argument1 = AsyncStorage.setItem.mock.calls[0][0];
      const argument2 = AsyncStorage.setItem.mock.calls[0][1];
      const deserializedArgument2 = JSON.parse(argument2);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(argument1).toBe(BITCOIN_ADDRESSES_STORAGE_KEY);

      expect(typeof deserializedArgument2).toBe('object');
      expect(deserializedArgument2['353128ef-a7bd-44f0-8a60-5c93c04e1c2e']).toBeTruthy();
      expect(deserializedArgument2['7c7c78c9-2d23-4c4c-9135-1f09f113d87b']).toBeTruthy();
    });
  });

  it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_SAVE_SUCCESS', () => {
    expect.hasAssertions();

    return saveAddresses()(dispatchMock, getStateMock).then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_ADDRESSES_SAVE_SUCCESS
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from AsyncStorage.setItem().
      AsyncStorage.setItem.mockImplementationOnce(() => Promise.reject(
        new Error('0eb57075-3d50-4f5a-adf8-a1b741a1d740')
      ));

      promise = saveAddresses()(dispatchMock, getStateMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('0eb57075-3d50-4f5a-adf8-a1b741a1d740');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_SAVE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_ADDRESSES_SAVE_FAILURE,
          error
        });
      });
    });
  });
});
