import AsyncStorage from '@react-native-community/async-storage';

import {
  load as loadAddresses,
  BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST,
  BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS,
  BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE
} from '../../../../../../../src/actions/bitcoin/wallet/addresses/external/load';

const BITCOIN_ADDRESSES_EXTERNAL_STORAGE_KEY = '@Bitcoin/Addresses/External';
const dispatchMock = jest.fn();

jest.mock('@react-native-community/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(
    '{ "8caaade9-5ab6-4442-9ed0-3a13424fc62e": {} }'
  ))
}));

describe('BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST).toBe('BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST');
  });
});

describe('BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS).toBe('BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS');
  });
});

describe('BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE).toBe('BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE');
  });
});

describe('load', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof loadAddresses).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(loadAddresses.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = loadAddresses();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST', () => {
    loadAddresses()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST
    });
  });

  it('gets the addresses from AsyncStorage', () => {
    expect.hasAssertions();

    return loadAddresses()(dispatchMock).then(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(BITCOIN_ADDRESSES_EXTERNAL_STORAGE_KEY);
    });
  });

  it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS with the addresses', () => {
    expect.hasAssertions();

    return loadAddresses()(dispatchMock).then((addresses) => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS,
        addresses
      });
    });
  });

  describe('the resolved value', () => {
    let addresses;

    beforeEach(() => {
      return loadAddresses()(dispatchMock).then((result) => {
        addresses = result;
      });
    });

    it('is an object that is deserialized from AsyncStorage', () => {
      expect(typeof addresses).toBe('object');
      expect(addresses).toBeTruthy();

      // This value comes from the mock of AsyncStorage.getItem().
      expect(Object.keys(addresses)[0]).toBe('8caaade9-5ab6-4442-9ed0-3a13424fc62e');
    });
  });

  describe('when there are no addresses', () => {
    it('resolves to an empty object', () => {
      expect.hasAssertions();

      // Make the AsyncStorage.getItem() mock return a promise that resolves to null.
      AsyncStorage.getItem.mockImplementationOnce(() => Promise.resolve(null));

      return loadAddresses()(dispatchMock).then((addresses) => {
        expect(addresses).toBeTruthy();
        expect(addresses).toMatchObject({});
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from AsyncStorage.getItem().
      AsyncStorage.getItem.mockImplementationOnce(() => Promise.reject(
        new Error('9847cca2-e84c-4d92-b83b-fb69d61412bc')
      ));

      promise = loadAddresses()(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('9847cca2-e84c-4d92-b83b-fb69d61412bc');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE,
          error
        });
      });
    });
  });
});
