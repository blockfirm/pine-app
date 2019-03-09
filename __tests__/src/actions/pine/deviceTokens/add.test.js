import addDeviceToken from '../../../../../src/PinePaymentProtocol/user/deviceTokens/add';

import {
  add as addDeviceTokenAction,
  PINE_DEVICE_TOKEN_ADD_REQUEST,
  PINE_DEVICE_TOKEN_ADD_SUCCESS,
  PINE_DEVICE_TOKEN_ADD_FAILURE
} from '../../../../../src/actions/pine/deviceTokens/add';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    user: {
      profile: {
        address: '3baba460-2572-4596-945e-4c4c2a0ef3a4'
      }
    }
  },
  keys: {
    items: {
      'cd6b374c-0425-4dae-9e20-f8b1e9270e6a': {
        id: 'cd6b374c-0425-4dae-9e20-f8b1e9270e6a'
      }
    }
  },
  notifications: {
    deviceToken: '5bfed250-8c4c-4b26-bb88-daacdfe6221f'
  }
}));

jest.mock('../../../../../src/PinePaymentProtocol/user/deviceTokens/add', () => {
  return jest.fn(() => Promise.resolve('007a79bc-171a-45d4-adf1-a47c2a62aea2'));
});

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('9d3c0fda-9103-4450-b203-b618cbb13458'));
});

describe('PINE_DEVICE_TOKEN_ADD_REQUEST', () => {
  it('equals "PINE_DEVICE_TOKEN_ADD_REQUEST"', () => {
    expect(PINE_DEVICE_TOKEN_ADD_REQUEST).toBe('PINE_DEVICE_TOKEN_ADD_REQUEST');
  });
});

describe('PINE_DEVICE_TOKEN_ADD_SUCCESS', () => {
  it('equals "PINE_DEVICE_TOKEN_ADD_SUCCESS"', () => {
    expect(PINE_DEVICE_TOKEN_ADD_SUCCESS).toBe('PINE_DEVICE_TOKEN_ADD_SUCCESS');
  });
});

describe('PINE_DEVICE_TOKEN_ADD_FAILURE', () => {
  it('equals "PINE_DEVICE_TOKEN_ADD_FAILURE"', () => {
    expect(PINE_DEVICE_TOKEN_ADD_FAILURE).toBe('PINE_DEVICE_TOKEN_ADD_FAILURE');
  });
});

describe('add', () => {
  beforeEach(() => {
    addDeviceToken.mockClear();
  });

  it('is a function', () => {
    expect(typeof addDeviceTokenAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = addDeviceTokenAction();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = addDeviceTokenAction();
    });

    it('dispatches an action of type PINE_DEVICE_TOKEN_ADD_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_DEVICE_TOKEN_ADD_REQUEST
      });
    });

    it('adds device token to user using its address and mnemonic', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedPineAddress = '3baba460-2572-4596-945e-4c4c2a0ef3a4';
        const expectedDeviceToken = { ios: '5bfed250-8c4c-4b26-bb88-daacdfe6221f' };
        const expectedMnemonic = '9d3c0fda-9103-4450-b203-b618cbb13458';

        expect(addDeviceToken).toHaveBeenCalled();

        expect(addDeviceToken).toHaveBeenCalledWith(expectedDeviceToken, {
          address: expectedPineAddress,
          mnemonic: expectedMnemonic
        });
      });
    });

    it('does not add device token if user does not have a Pine address', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          user: {
            profile: {}
          }
        },
        keys: {
          items: {}
        },
        notifications: {
          deviceToken: '197e6dd9-b885-419d-b036-d224dafbdcf9'
        }
      }));

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(addDeviceToken).toHaveBeenCalledTimes(0);
      });
    });

    it('does not add device token if there is no device token', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          user: {
            profile: {
              address: '4e7e1ec1-cda6-4f17-801b-135c007633ad'
            }
          }
        },
        keys: {
          items: {}
        },
        notifications: {}
      }));

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(addDeviceToken).toHaveBeenCalledTimes(0);
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

      it('dispatches an action of type PINE_DEVICE_TOKEN_ADD_SUCCESS with the device token ID', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_DEVICE_TOKEN_ADD_SUCCESS,
            deviceTokenId: '007a79bc-171a-45d4-adf1-a47c2a62aea2'
          });
        });
      });

      it('resolves to the added device token ID', () => {
        expect.hasAssertions();

        return promise.then((deviceTokenId) => {
          expect(deviceTokenId).toBe('007a79bc-171a-45d4-adf1-a47c2a62aea2');
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from addDeviceToken().
        addDeviceToken.mockImplementationOnce(() => Promise.reject(
          new Error('e34b8cad-bd3c-4a5c-807e-7458de0cfbf4')
        ));

        promise = addDeviceTokenAction()(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_DEVICE_TOKEN_ADD_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_DEVICE_TOKEN_ADD_FAILURE,
            error: expect.objectContaining({
              message: 'e34b8cad-bd3c-4a5c-807e-7458de0cfbf4'
            })
          });
        });
      });
    });
  });
});
