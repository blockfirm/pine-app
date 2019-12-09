import getMnemonicByKey from '../../../../../src/crypto/getMnemonicByKey';
import getAccountKeyPairFromMnemonic from '../../../../../src/clients/paymentServer/crypto/getAccountKeyPairFromMnemonic';
import getUserIdFromPublicKey from '../../../../../src/clients/paymentServer/crypto/getUserIdFromPublicKey';

import {
  load as loadPineCredentials,
  PINE_CREDENTIALS_LOAD_REQUEST,
  PINE_CREDENTIALS_LOAD_SUCCESS,
  PINE_CREDENTIALS_LOAD_FAILURE
} from '../../../../../src/actions/paymentServer/credentials/load';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    initialized: true,
    user: {
      profile: {
        address: 'f7c3a6b0-39a4-485d-97de-fb27fb88e801'
      }
    },
    bitcoin: {
      network: 'testnet'
    }
  },
  pine: {
    credentials: null
  },
  keys: {
    items: {
      '2a87d7bf-5916-4eb1-95e8-0ae0d723d426': {
        id: '2a87d7bf-5916-4eb1-95e8-0ae0d723d426'
      }
    }
  }
}));

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('81325032-4f6b-46b0-9b0e-217bdb882c04'));
});

jest.mock('../../../../../src/clients/paymentServer/crypto/getAccountKeyPairFromMnemonic', () => {
  return jest.fn(() => 'ac3d6c4c-e430-4852-812e-a11046f38a66');
});

jest.mock('../../../../../src/clients/paymentServer/crypto/getUserIdFromPublicKey', () => {
  return jest.fn(() => 'b372970c-91a6-45c3-9bb2-7aef0f312ded');
});

describe('PINE_CREDENTIALS_LOAD_REQUEST', () => {
  it('equals "PINE_CREDENTIALS_LOAD_REQUEST"', () => {
    expect(PINE_CREDENTIALS_LOAD_REQUEST).toBe('PINE_CREDENTIALS_LOAD_REQUEST');
  });
});

describe('PINE_CREDENTIALS_LOAD_SUCCESS', () => {
  it('equals "PINE_CREDENTIALS_LOAD_SUCCESS"', () => {
    expect(PINE_CREDENTIALS_LOAD_SUCCESS).toBe('PINE_CREDENTIALS_LOAD_SUCCESS');
  });
});

describe('PINE_CREDENTIALS_LOAD_FAILURE', () => {
  it('equals "PINE_CREDENTIALS_LOAD_FAILURE"', () => {
    expect(PINE_CREDENTIALS_LOAD_FAILURE).toBe('PINE_CREDENTIALS_LOAD_FAILURE');
  });
});

describe('load', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getMnemonicByKey.mockClear();
    getAccountKeyPairFromMnemonic.mockClear();
    getUserIdFromPublicKey.mockClear();
  });

  it('is a function', () => {
    expect(typeof loadPineCredentials).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = loadPineCredentials();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = loadPineCredentials();
    });

    it('dispatches an action of type PINE_CREDENTIALS_LOAD_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_CREDENTIALS_LOAD_REQUEST
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

      it('dispatches an action of type PINE_CREDENTIALS_LOAD_SUCCESS with the credentials', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CREDENTIALS_LOAD_SUCCESS,
            credentials: expect.objectContaining({
              address: 'f7c3a6b0-39a4-485d-97de-fb27fb88e801', // Mocked in the state.
              keyPair: 'ac3d6c4c-e430-4852-812e-a11046f38a66', // Mocked with getAccountKeyPairFromMnemonic().
              userId: 'b372970c-91a6-45c3-9bb2-7aef0f312ded' // Mocked with getUserIdFromPublicKey().
            })
          });
        });
      });
    });

    describe('when the credentials has already been loaded', () => {
      it('does not load them again', () => {
        expect.hasAssertions();

        getStateMock.mockImplementationOnce(() => ({
          settings: {
            initialized: true,
            user: {
              profile: {
                address: 'f7c3a6b0-39a4-485d-97de-fb27fb88e801'
              }
            },
            bitcoin: {
              network: 'testnet'
            }
          },
          pine: {
            credentials: {
              userId: 'b825712e-98e8-4c47-84b3-ffb6f2cb5f05'
            }
          }
        }));

        return loadPineCredentials()(dispatchMock, getStateMock).then(() => {
          expect(getMnemonicByKey).not.toHaveBeenCalled();

          expect(dispatchMock).not.toHaveBeenCalledWith(expect.objectContaining({
            type: PINE_CREDENTIALS_LOAD_SUCCESS
          }));
        });
      });
    });

    describe('when the app has not been initialized', () => {
      it('does not load the credentials', () => {
        expect.hasAssertions();

        getStateMock.mockImplementationOnce(() => ({
          settings: {
            initialized: false,
            user: {
              profile: {
                address: 'f7c3a6b0-39a4-485d-97de-fb27fb88e801'
              }
            },
            bitcoin: {
              network: 'testnet'
            }
          },
          pine: {
            credentials: null
          }
        }));

        return loadPineCredentials()(dispatchMock, getStateMock).then(() => {
          expect(getMnemonicByKey).not.toHaveBeenCalled();

          expect(dispatchMock).not.toHaveBeenCalledWith(expect.objectContaining({
            type: PINE_CREDENTIALS_LOAD_SUCCESS
          }));
        });
      });
    });

    describe('when there is no pine address', () => {
      it('does not load the credentials', () => {
        expect.hasAssertions();

        getStateMock.mockImplementationOnce(() => ({
          settings: {
            initialized: true,
            user: {
              profile: {
                address: ''
              }
            },
            bitcoin: {
              network: 'testnet'
            }
          },
          pine: {
            credentials: null
          }
        }));

        return loadPineCredentials()(dispatchMock, getStateMock).then(() => {
          expect(getMnemonicByKey).not.toHaveBeenCalled();

          expect(dispatchMock).not.toHaveBeenCalledWith(expect.objectContaining({
            type: PINE_CREDENTIALS_LOAD_SUCCESS
          }));
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from getMnemonicByKey().
        getMnemonicByKey.mockImplementationOnce(() => Promise.reject(
          new Error('14255bd3-c1cc-4bdf-9380-2dde59ccbd57')
        ));

        promise = loadPineCredentials()(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CREDENTIALS_LOAD_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CREDENTIALS_LOAD_FAILURE,
            error: expect.objectContaining({
              message: '14255bd3-c1cc-4bdf-9380-2dde59ccbd57'
            })
          });
        });
      });
    });
  });
});
