import * as api from '../../../../../src/api';

import {
  getSubscriptionCount,
  BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST,
  BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS,
  BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE
} from '../../../../../src/actions/bitcoin/subscriptions/getSubscriptionCount';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '353584e5-9024-477e-be1b-3f79dbc6a060'
    }
  },
  notifications: {
    deviceToken: '859e90af-deb2-4d6e-a831-88053a8f00a5'
  }
}));

jest.mock('../../../../../src/api', () => ({
  bitcoin: {
    subscriptions: {
      getByDeviceToken: jest.fn(() => Promise.resolve({
        numberOfSubscriptions: 5
      }))
    }
  }
}));

describe('BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST).toBe('BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS).toBe('BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE).toBe('BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE');
  });
});

describe('getSubscriptionCount', () => {
  beforeEach(() => {
    api.bitcoin.subscriptions.getByDeviceToken.mockClear();
  });

  it('is a function', () => {
    expect(typeof getSubscriptionCount).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = getSubscriptionCount();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getSubscriptionCount();
    });

    it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST
      });
    });

    it('getSubscriptionCounts the addresses with api.bitcoin.subscriptions.getByDeviceToken() with the device token from state', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedDeviceToken = '859e90af-deb2-4d6e-a831-88053a8f00a5';

        const expectedOptions = {
          baseUrl: '353584e5-9024-477e-be1b-3f79dbc6a060'
        };

        expect(api.bitcoin.subscriptions.getByDeviceToken).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.subscriptions.getByDeviceToken).toHaveBeenCalledWith(expectedDeviceToken, expectedOptions);
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

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS with the subscription count', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS,
            numberOfSubscriptions: 5
          });
        });
      });

      it('resolves to the subscription count', () => {
        expect.hasAssertions();

        return promise.then((numberOfSubscriptions) => {
          expect(numberOfSubscriptions).toBe(5);
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.subscriptions.getByDeviceToken().
        api.bitcoin.subscriptions.getByDeviceToken.mockImplementationOnce(() => Promise.reject(
          new Error('810fab80-01a4-4d2d-8bf9-74d90efd75bc')
        ));

        promise = getSubscriptionCount()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('810fab80-01a4-4d2d-8bf9-74d90efd75bc');
        });
      });

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE,
            error
          });
        });
      });
    });
  });
});
