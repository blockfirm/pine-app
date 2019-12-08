import removeDeviceToken from '../../../../../src/clients/paymentServer/user/deviceTokens/remove';
import { add as addDeviceTokenAction } from '../../../../../src/actions/pine/deviceTokens/add';

import {
  remove as removeDeviceTokenAction,
  PINE_DEVICE_TOKEN_REMOVE_REQUEST,
  PINE_DEVICE_TOKEN_REMOVE_SUCCESS,
  PINE_DEVICE_TOKEN_REMOVE_FAILURE
} from '../../../../../src/actions/pine/deviceTokens/remove';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action();
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  pine: {
    credentials: {
      userId: 'ec003e26-8ef2-4344-9c1c-649751242b31'
    }
  },
  notifications: {
    deviceToken: '5bfed250-8c4c-4b26-bb88-daacdfe6221f'
  }
}));

jest.mock('../../../../../src/actions/pine/deviceTokens/add', () => ({
  add: jest.fn(() => {
    return () => Promise.resolve('30f9db6d-2113-433c-b3d5-4bbe642a727f');
  })
}));

jest.mock('../../../../../src/clients/paymentServer/user/deviceTokens/remove', () => {
  return jest.fn(() => Promise.resolve('007a79bc-171a-45d4-adf1-a47c2a62aea2'));
});

describe('PINE_DEVICE_TOKEN_REMOVE_REQUEST', () => {
  it('equals "PINE_DEVICE_TOKEN_REMOVE_REQUEST"', () => {
    expect(PINE_DEVICE_TOKEN_REMOVE_REQUEST).toBe('PINE_DEVICE_TOKEN_REMOVE_REQUEST');
  });
});

describe('PINE_DEVICE_TOKEN_REMOVE_SUCCESS', () => {
  it('equals "PINE_DEVICE_TOKEN_REMOVE_SUCCESS"', () => {
    expect(PINE_DEVICE_TOKEN_REMOVE_SUCCESS).toBe('PINE_DEVICE_TOKEN_REMOVE_SUCCESS');
  });
});

describe('PINE_DEVICE_TOKEN_REMOVE_FAILURE', () => {
  it('equals "PINE_DEVICE_TOKEN_REMOVE_FAILURE"', () => {
    expect(PINE_DEVICE_TOKEN_REMOVE_FAILURE).toBe('PINE_DEVICE_TOKEN_REMOVE_FAILURE');
  });
});

describe('remove', () => {
  beforeEach(() => {
    removeDeviceToken.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeDeviceTokenAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = removeDeviceTokenAction();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = removeDeviceTokenAction();
    });

    it('dispatches an action of type PINE_DEVICE_TOKEN_REMOVE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_DEVICE_TOKEN_REMOVE_REQUEST
      });
    });

    it('adds the device token first to get its ID', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(addDeviceTokenAction).toHaveBeenCalled();
      });
    });

    it('removes device token from user using its credentials from state', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedDeviceTokenId = '30f9db6d-2113-433c-b3d5-4bbe642a727f';

        expect(removeDeviceToken).toHaveBeenCalled();

        expect(removeDeviceToken).toHaveBeenCalledWith(expectedDeviceTokenId, {
          userId: 'ec003e26-8ef2-4344-9c1c-649751242b31'
        });
      });
    });

    it('does not remove device token if user does not have any credentials', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        pine: {
          credentials: null
        },
        notifications: {
          deviceToken: '197e6dd9-b885-419d-b036-d224dafbdcf9'
        }
      }));

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(removeDeviceToken).toHaveBeenCalledTimes(0);
      });
    });

    it('does not remove device token if there is no device token', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        pine: {
          credentials: {
            userId: '0abbe90a-d67d-4e53-a34c-672c4de77bb7'
          }
        },
        notifications: {}
      }));

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(removeDeviceToken).toHaveBeenCalledTimes(0);
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

      it('dispatches an action of type PINE_DEVICE_TOKEN_REMOVE_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_DEVICE_TOKEN_REMOVE_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from removeDeviceToken().
        removeDeviceToken.mockImplementationOnce(() => Promise.reject(
          new Error('e34b8cad-bd3c-4a5c-807e-7458de0cfbf4')
        ));

        promise = removeDeviceTokenAction()(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_DEVICE_TOKEN_REMOVE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_DEVICE_TOKEN_REMOVE_FAILURE,
            error: expect.objectContaining({
              message: 'e34b8cad-bd3c-4a5c-807e-7458de0cfbf4'
            })
          });
        });
      });
    });
  });
});
