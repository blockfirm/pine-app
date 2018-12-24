import { getSubscriptionCount } from '../../../../../src/actions/bitcoin/subscriptions/getSubscriptionCount';
import { subscribe } from '../../../../../src/actions/bitcoin/subscriptions/subscribe';

import {
  sync,
  BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST,
  BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS,
  BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE
} from '../../../../../src/actions/bitcoin/subscriptions/sync';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  notifications: {
    deviceToken: '2dfa2f8c-9d40-4b85-b3a7-50d8a10c23d1'
  },
  bitcoin: {
    wallet: {
      addresses: {
        external: {
          items: {
            '574fcf68-ad53-4798-9dd4-5e1c7a0d522c': {
              index: 0
            },
            'fc03a909-f9ef-491c-a7ab-03c57a579c11': {
              index: 2
            },
            'f8ee1920-2823-4bd9-99ee-6b5f08ad1640': {
              index: 4
            },
            'ac2e760d-0c2b-4e1b-be73-5b98f288621c': {
              index: 3
            },
            'dfac1f36-5abe-4102-a2ae-8d09d94488df': {
              index: 1
            },
            '21d0857c-9d45-488c-bd8a-397bd678c0da': {
              index: 5
            }
          }
        }
      }
    }
  }
}));

jest.mock('../../../../../src/actions/bitcoin/subscriptions/getSubscriptionCount', () => ({
  getSubscriptionCount: jest.fn(() => Promise.resolve(4))
}));

jest.mock('../../../../../src/actions/bitcoin/subscriptions/subscribe', () => ({
  subscribe: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST).toBe('BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS).toBe('BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE).toBe('BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE');
  });
});

describe('sync', () => {
  beforeEach(() => {
    getSubscriptionCount.mockClear();
    subscribe.mockClear();
  });

  it('is a function', () => {
    expect(typeof sync).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = sync();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = sync();
    });

    it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST
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

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from getSubscriptionCount().
        getSubscriptionCount.mockImplementationOnce(() => Promise.reject(
          new Error('c58c8cfe-3d03-43ba-82f3-4a77eb055521')
        ));

        promise = sync()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('c58c8cfe-3d03-43ba-82f3-4a77eb055521');
        });
      });

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE,
            error
          });
        });
      });
    });
  });

  it('subscribes all external addresses that has not been subscribed yet', () => {
    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      const expectedAddresses = [
        'f8ee1920-2823-4bd9-99ee-6b5f08ad1640',
        '21d0857c-9d45-488c-bd8a-397bd678c0da'
      ];

      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith(expectedAddresses);
    });
  });
});
