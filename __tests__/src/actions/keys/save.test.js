import { AsyncStorage } from 'react-native';
import {
  save as saveKeys,
  KEYS_SAVE_REQUEST,
  KEYS_SAVE_SUCCESS,
  KEYS_SAVE_FAILURE
} from '../../../../src/actions/keys/save';

const KEYS_STORAGE_KEY = '@Keys';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  keys: {
    items: {
      '1ccf00a9-ba76-4bfc-bc2e-bc05b0517b3b': {
        id: '1ccf00a9-ba76-4bfc-bc2e-bc05b0517b3b'
      },
      '11003f45-ef93-4daa-b159-94315c446397': {
        id: '11003f45-ef93-4daa-b159-94315c446397'
      }
    }
  }
}));

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => Promise.resolve())
  }
}));

describe('KEYS_SAVE_REQUEST', () => {
  it('equals "KEYS_SAVE_REQUEST"', () => {
    expect(KEYS_SAVE_REQUEST).toBe('KEYS_SAVE_REQUEST');
  });
});

describe('KEYS_SAVE_SUCCESS', () => {
  it('equals "KEYS_SAVE_SUCCESS"', () => {
    expect(KEYS_SAVE_SUCCESS).toBe('KEYS_SAVE_SUCCESS');
  });
});

describe('KEYS_SAVE_FAILURE', () => {
  it('equals "KEYS_SAVE_FAILURE"', () => {
    expect(KEYS_SAVE_FAILURE).toBe('KEYS_SAVE_FAILURE');
  });
});

describe('save', () => {
  beforeEach(() => {
    AsyncStorage.setItem.mockClear();
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof saveKeys).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(saveKeys.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = saveKeys();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = saveKeys();
    });

    it('dispatches an action of type KEYS_SAVE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_SAVE_REQUEST
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('calls getState() to get the keys from the state', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(getStateMock).toHaveBeenCalledTimes(1);
        });
      });

      it('serializes the keys and saves it to AsyncStorage', () => {
        expect.hasAssertions();

        return promise.then(() => {
          const argument1 = AsyncStorage.setItem.mock.calls[0][0];
          const argument2 = AsyncStorage.setItem.mock.calls[0][1];
          const deserializedArgument2 = JSON.parse(argument2);

          expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
          expect(argument1).toBe(KEYS_STORAGE_KEY);

          expect(typeof deserializedArgument2).toBe('object');
          expect(deserializedArgument2['1ccf00a9-ba76-4bfc-bc2e-bc05b0517b3b']).toBeTruthy();
          expect(deserializedArgument2['11003f45-ef93-4daa-b159-94315c446397']).toBeTruthy();
        });
      });

      it('dispatches an action of type KEYS_SAVE_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: KEYS_SAVE_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.setItem().
        AsyncStorage.setItem.mockImplementationOnce(() => new Promise.reject(
          new Error('d73daa18-769b-48cc-a893-244a5507e768')
        ));

        promise = saveKeys()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('d73daa18-769b-48cc-a893-244a5507e768');
        });
      });

      it('dispatches an action of type KEYS_SAVE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: KEYS_SAVE_FAILURE,
            error
          });
        });
      });
    });
  });
});
