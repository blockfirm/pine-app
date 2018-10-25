import saveMnemonicByKey from '../../../../src/crypto/saveMnemonicByKey';

import {
  add as addKey,
  KEYS_ADD_REQUEST,
  KEYS_ADD_SUCCESS,
  KEYS_ADD_FAILURE
} from '../../../../src/actions/keys/add';

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    bitcoin: {
      network: 'testnet'
    }
  }
}));

jest.mock('../../../../src/actions/keys/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../src/crypto/saveMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../../../../src/crypto/getKeyMetadata', () => {
  return () => ({
    test: 'c802927d-ee35-42fe-983e-e248bfebf781'
  });
});

describe('KEYS_ADD_REQUEST', () => {
  it('equals "KEYS_ADD_REQUEST"', () => {
    expect(KEYS_ADD_REQUEST).toBe('KEYS_ADD_REQUEST');
  });
});

describe('KEYS_ADD_SUCCESS', () => {
  it('equals "KEYS_ADD_SUCCESS"', () => {
    expect(KEYS_ADD_SUCCESS).toBe('KEYS_ADD_SUCCESS');
  });
});

describe('KEYS_ADD_FAILURE', () => {
  it('equals "KEYS_ADD_FAILURE"', () => {
    expect(KEYS_ADD_FAILURE).toBe('KEYS_ADD_FAILURE');
  });
});

describe('add', () => {
  let mnemonic;

  beforeEach(() => {
    mnemonic = 'test test test test test test test test test test test test';
    saveMnemonicByKey.mockClear();
  });

  it('is a function', () => {
    expect(typeof addKey).toBe('function');
  });

  it('accepts one argument', () => {
    expect(addKey.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = addKey(mnemonic);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = addKey(mnemonic);
    });

    it('dispatches an action of type KEYS_ADD_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: KEYS_ADD_REQUEST
      });
    });

    it('sets key.id to a uuid (v4)', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then((key) => {
        expect(key.id).toMatch(uuidRegex);
      });
    });

    it('saves the mnemonic with saveMnemonicByKey', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then((key) => {
        expect(saveMnemonicByKey).toHaveBeenCalledWith(mnemonic, key.id);
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

      it('resolves to the metadata', () => {
        expect.hasAssertions();

        return promise.then((key) => {
          // This is mocked at the top of the file.
          expect(key.test).toBe('c802927d-ee35-42fe-983e-e248bfebf781');
        });
      });

      it('dispatches an action of type KEYS_ADD_SUCCESS with the metadata', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: KEYS_ADD_SUCCESS,
            key: expect.objectContaining({
              test: 'c802927d-ee35-42fe-983e-e248bfebf781' // This is mocked at the top of the file.
            })
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from saveMnemonicByKey().
        saveMnemonicByKey.mockImplementationOnce(() => Promise.reject(
          new Error('ed03a78f-f465-4313-ba57-85e0c5ddb5e3')
        ));

        promise = addKey(mnemonic)(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('ed03a78f-f465-4313-ba57-85e0c5ddb5e3');
        });
      });

      it('dispatches an action of type KEYS_ADD_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: KEYS_ADD_FAILURE,
            error
          });
        });
      });
    });
  });
});
