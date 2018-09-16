import { AsyncStorage } from 'react-native';
import {
  save as saveUtxos,
  BITCOIN_WALLET_UTXOS_SAVE_REQUEST,
  BITCOIN_WALLET_UTXOS_SAVE_SUCCESS,
  BITCOIN_WALLET_UTXOS_SAVE_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/utxos/save';

const BITCOIN_UTXOS_STORAGE_KEY = '@Bitcoin/Utxos';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  bitcoin: {
    wallet: {
      utxos: {
        items: [
          { txid: '70f6a0d0-4712-46a6-8274-215ccf10f8ea' },
          { txid: '2dae334c-d5a7-4b66-8edb-ad48a1f38439' }
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

describe('BITCOIN_WALLET_UTXOS_SAVE_REQUEST', () => {
  it('equals "BITCOIN_WALLET_UTXOS_SAVE_REQUEST"', () => {
    expect(BITCOIN_WALLET_UTXOS_SAVE_REQUEST).toBe('BITCOIN_WALLET_UTXOS_SAVE_REQUEST');
  });
});

describe('BITCOIN_WALLET_UTXOS_SAVE_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_UTXOS_SAVE_SUCCESS"', () => {
    expect(BITCOIN_WALLET_UTXOS_SAVE_SUCCESS).toBe('BITCOIN_WALLET_UTXOS_SAVE_SUCCESS');
  });
});

describe('BITCOIN_WALLET_UTXOS_SAVE_FAILURE', () => {
  it('equals "BITCOIN_WALLET_UTXOS_SAVE_FAILURE"', () => {
    expect(BITCOIN_WALLET_UTXOS_SAVE_FAILURE).toBe('BITCOIN_WALLET_UTXOS_SAVE_FAILURE');
  });
});

describe('save', () => {
  beforeEach(() => {
    AsyncStorage.setItem.mockClear();
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof saveUtxos).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(saveUtxos.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = saveUtxos();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_UTXOS_SAVE_REQUEST', () => {
    saveUtxos()(dispatchMock, getStateMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_UTXOS_SAVE_REQUEST
    });
  });

  it('calls getState() to get the utxos from the state', () => {
    expect.hasAssertions();

    return saveUtxos()(dispatchMock, getStateMock).then(() => {
      expect(getStateMock).toHaveBeenCalledTimes(1);
    });
  });

  it('serializes the utxos and saves it to AsyncStorage', () => {
    expect.hasAssertions();

    return saveUtxos()(dispatchMock, getStateMock).then(() => {
      const argument1 = AsyncStorage.setItem.mock.calls[0][0];
      const argument2 = AsyncStorage.setItem.mock.calls[0][1];
      const deserializedArgument2 = JSON.parse(argument2);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
      expect(argument1).toBe(BITCOIN_UTXOS_STORAGE_KEY);

      expect(typeof deserializedArgument2).toBe('object');
      expect(deserializedArgument2[0].txid).toBe('70f6a0d0-4712-46a6-8274-215ccf10f8ea');
      expect(deserializedArgument2[1].txid).toBe('2dae334c-d5a7-4b66-8edb-ad48a1f38439');
    });
  });

  it('dispatches an action of type BITCOIN_WALLET_UTXOS_SAVE_SUCCESS', () => {
    expect.hasAssertions();

    return saveUtxos()(dispatchMock, getStateMock).then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_UTXOS_SAVE_SUCCESS
      });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from AsyncStorage.setItem().
      AsyncStorage.setItem.mockImplementationOnce(() => Promise.reject(
        new Error('d0ff542a-2865-4700-8aa5-28e16ae08a3d')
      ));

      promise = saveUtxos()(dispatchMock, getStateMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('d0ff542a-2865-4700-8aa5-28e16ae08a3d');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_UTXOS_SAVE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_UTXOS_SAVE_FAILURE,
          error
        });
      });
    });
  });
});
