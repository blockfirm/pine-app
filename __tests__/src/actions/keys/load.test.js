import AsyncStorage from '@react-native-community/async-storage';

import {
  load as loadKeys,
  KEYS_LOAD_REQUEST,
  KEYS_LOAD_SUCCESS,
  KEYS_LOAD_FAILURE
} from '../../../../src/actions/keys/load';

const KEYS_STORAGE_KEY = '@Keys';
const dispatchMock = jest.fn();

jest.mock('@react-native-community/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(
    '{ "id": "204d5efa-8889-4206-aa22-2865d1b94d09" }'
  ))
}));

describe('KEYS_LOAD_REQUEST', () => {
  it('equals "KEYS_LOAD_REQUEST"', () => {
    expect(KEYS_LOAD_REQUEST).toBe('KEYS_LOAD_REQUEST');
  });
});

describe('KEYS_LOAD_SUCCESS', () => {
  it('equals "KEYS_LOAD_SUCCESS"', () => {
    expect(KEYS_LOAD_SUCCESS).toBe('KEYS_LOAD_SUCCESS');
  });
});

describe('KEYS_LOAD_FAILURE', () => {
  it('equals "KEYS_LOAD_FAILURE"', () => {
    expect(KEYS_LOAD_FAILURE).toBe('KEYS_LOAD_FAILURE');
  });
});

describe('load', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof loadKeys).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(loadKeys.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = loadKeys();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = loadKeys();
    });

    it('dispatches an action of type KEYS_LOAD_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_LOAD_REQUEST
      });
    });

    it('gets the keys from AsyncStorage', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(KEYS_STORAGE_KEY);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock);
      });

      it('dispatches an action of type KEYS_LOAD_SUCCESS with the keys', () => {
        expect.hasAssertions();

        return promise.then((keys) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: KEYS_LOAD_SUCCESS,
            keys
          });
        });
      });

      describe('the resolved value', () => {
        let keys;

        beforeEach(() => {
          return promise.then((result) => {
            keys = result;
          });
        });

        it('is an object that is deserialized from AsyncStorage', () => {
          expect(typeof keys).toBe('object');
          expect(keys).toBeTruthy();

          // This value comes from the mock of AsyncStorage.getItem().
          expect(keys.id).toBe('204d5efa-8889-4206-aa22-2865d1b94d09');
        });
      });

      describe('when there are no keys', () => {
        it('resolves to an empty object', () => {
          expect.hasAssertions();

          // Make the AsyncStorage.getItem() mock return a promise that resolves to null.
          AsyncStorage.getItem.mockImplementationOnce(() => Promise.resolve(null));

          return loadKeys()(dispatchMock).then((keys) => {
            expect(keys).toBeTruthy();
            expect(keys).toMatchObject({});
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.getItem().
        AsyncStorage.getItem.mockImplementationOnce(() => Promise.reject(
          new Error('4df3668f-d01d-4cf1-9f2b-73036baa5d88')
        ));

        promise = loadKeys()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('4df3668f-d01d-4cf1-9f2b-73036baa5d88');
        });
      });

      it('dispatches an action of type KEYS_LOAD_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: KEYS_LOAD_FAILURE,
            error
          });
        });
      });
    });
  });
});
