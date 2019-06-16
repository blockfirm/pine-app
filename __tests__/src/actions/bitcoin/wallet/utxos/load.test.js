import AsyncStorage from '@react-native-community/async-storage';

import {
  load as loadUtxos,
  BITCOIN_WALLET_UTXOS_LOAD_REQUEST,
  BITCOIN_WALLET_UTXOS_LOAD_SUCCESS,
  BITCOIN_WALLET_UTXOS_LOAD_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/utxos/load';

const BITCOIN_UTXOS_STORAGE_KEY = '@Bitcoin/Utxos';
const dispatchMock = jest.fn();

jest.mock('@react-native-community/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(
    '[ { "txid": "e060a600-8747-4867-9e6e-601523660918" } ]'
  ))
}));

describe('BITCOIN_WALLET_UTXOS_LOAD_REQUEST', () => {
  it('equals "BITCOIN_WALLET_UTXOS_LOAD_REQUEST"', () => {
    expect(BITCOIN_WALLET_UTXOS_LOAD_REQUEST).toBe('BITCOIN_WALLET_UTXOS_LOAD_REQUEST');
  });
});

describe('BITCOIN_WALLET_UTXOS_LOAD_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_UTXOS_LOAD_SUCCESS"', () => {
    expect(BITCOIN_WALLET_UTXOS_LOAD_SUCCESS).toBe('BITCOIN_WALLET_UTXOS_LOAD_SUCCESS');
  });
});

describe('BITCOIN_WALLET_UTXOS_LOAD_FAILURE', () => {
  it('equals "BITCOIN_WALLET_UTXOS_LOAD_FAILURE"', () => {
    expect(BITCOIN_WALLET_UTXOS_LOAD_FAILURE).toBe('BITCOIN_WALLET_UTXOS_LOAD_FAILURE');
  });
});

describe('load', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof loadUtxos).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(loadUtxos.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = loadUtxos();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_UTXOS_LOAD_REQUEST', () => {
    loadUtxos()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_UTXOS_LOAD_REQUEST
    });
  });

  it('gets the utxos from AsyncStorage', () => {
    expect.hasAssertions();

    return loadUtxos()(dispatchMock).then(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(BITCOIN_UTXOS_STORAGE_KEY);
    });
  });

  it('dispatches an action of type BITCOIN_WALLET_UTXOS_LOAD_SUCCESS with the utxos', () => {
    expect.hasAssertions();

    return loadUtxos()(dispatchMock).then((utxos) => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_UTXOS_LOAD_SUCCESS,
        utxos
      });
    });
  });

  describe('the resolved value', () => {
    let utxos;

    beforeEach(() => {
      return loadUtxos()(dispatchMock).then((result) => {
        utxos = result;
      });
    });

    it('is an array that is deserialized from AsyncStorage', () => {
      expect(Array.isArray(utxos)).toBe(true);
      expect(utxos).toBeTruthy();

      // This value comes from the mock of AsyncStorage.getItem().
      expect(utxos[0].txid).toBe('e060a600-8747-4867-9e6e-601523660918');
    });
  });

  describe('when there are no utxos', () => {
    it('resolves to an empty array', () => {
      expect.hasAssertions();

      // Make the AsyncStorage.getItem() mock return a promise that resolves to null.
      AsyncStorage.getItem.mockImplementationOnce(() => Promise.resolve(null));

      return loadUtxos()(dispatchMock).then((utxos) => {
        expect(utxos).toBeTruthy();
        expect(Array.isArray(utxos)).toBe(true);
        expect(utxos.length).toBe(0);
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from AsyncStorage.getItem().
      AsyncStorage.getItem.mockImplementationOnce(() => Promise.reject(
        new Error('2685751a-363f-4c3f-bffb-e552bd3fa650')
      ));

      promise = loadUtxos()(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('2685751a-363f-4c3f-bffb-e552bd3fa650');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_UTXOS_LOAD_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_UTXOS_LOAD_FAILURE,
          error
        });
      });
    });
  });
});
