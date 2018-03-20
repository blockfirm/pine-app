import {
  remove as removeKey,
  KEYS_REMOVE_REQUEST,
  KEYS_REMOVE_SUCCESS,
  KEYS_REMOVE_FAILURE
} from '../../../../src/actions/keys/remove';

const dispatchMock = jest.fn();

describe('KEYS_REMOVE_REQUEST', () => {
  it('equals "KEYS_REMOVE_REQUEST"', () => {
    expect(KEYS_REMOVE_REQUEST).toBe('KEYS_REMOVE_REQUEST');
  });
});

describe('KEYS_REMOVE_SUCCESS', () => {
  it('equals "KEYS_REMOVE_SUCCESS"', () => {
    expect(KEYS_REMOVE_SUCCESS).toBe('KEYS_REMOVE_SUCCESS');
  });
});

describe('KEYS_REMOVE_FAILURE', () => {
  it('equals "KEYS_REMOVE_FAILURE"', () => {
    expect(KEYS_REMOVE_FAILURE).toBe('KEYS_REMOVE_FAILURE');
  });
});

describe('remove', () => {
  let fakeKey;

  beforeEach(() => {
    fakeKey = {
      id: 'c8cb001e-269f-42b9-9df2-1ea1e8014768'
    };
  });

  it('is a function', () => {
    expect(typeof removeKey).toBe('function');
  });

  it('accepts one argument', () => {
    expect(removeKey.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = removeKey(fakeKey);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = removeKey(fakeKey);
    });

    it('dispatches an action of type KEYS_REMOVE_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_REMOVE_REQUEST
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

      it('dispatches an action of type KEYS_REMOVE_SUCCESS with the key', () => {
        expect.hasAssertions();

        return promise.then((key) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: KEYS_REMOVE_SUCCESS,
            key
          });
        });
      });

      it('resolves to the passed key', () => {
        expect.hasAssertions();

        return promise.then((key) => {
          expect(key).toBe(fakeKey);
        });
      });
    });
  });

  describe('when key.id is undefined', () => {
    let promise;

    beforeEach(() => {
      fakeKey.id = undefined;
      promise = removeKey(fakeKey)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown key.');
      });
    });

    it('dispatches an action of type KEYS_REMOVE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: KEYS_REMOVE_FAILURE,
          error
        });
      });
    });
  });

  describe('when key is undefined', () => {
    let promise;

    beforeEach(() => {
      fakeKey = undefined;
      promise = removeKey(fakeKey)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown key.');
      });
    });

    it('dispatches an action of type KEYS_REMOVE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: KEYS_REMOVE_FAILURE,
          error
        });
      });
    });
  });
});
