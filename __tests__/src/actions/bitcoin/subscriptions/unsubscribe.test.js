import * as api from '../../../../../src/api';

import {
  unsubscribe,
  BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST,
  BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS,
  BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE
} from '../../../../../src/actions/bitcoin/subscriptions/unsubscribe';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '8d7f02ea-fc8b-4b4e-b7a3-739ae1887ad9'
    }
  },
  notifications: {
    deviceToken: '62f1e9d6-d2f2-4b72-9ec1-ff75db9c0bb1'
  }
}));

jest.mock('../../../../../src/api', () => ({
  bitcoin: {
    subscriptions: {
      deleteByDeviceToken: jest.fn(() => Promise.resolve())
    }
  }
}));

describe('BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST).toBe('BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS).toBe('BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE).toBe('BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE');
  });
});

describe('unsubscribe', () => {
  beforeEach(() => {
    api.bitcoin.subscriptions.deleteByDeviceToken.mockClear();
  });

  it('is a function', () => {
    expect(typeof unsubscribe).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = unsubscribe();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = unsubscribe();
    });

    it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST
      });
    });

    it('unsubscribes the addresses with api.bitcoin.subscriptions.deleteByDeviceToken() with the device token from state', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedDeviceToken = '62f1e9d6-d2f2-4b72-9ec1-ff75db9c0bb1';

        const expectedOptions = {
          baseUrl: '8d7f02ea-fc8b-4b4e-b7a3-739ae1887ad9'
        };

        expect(api.bitcoin.subscriptions.deleteByDeviceToken).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.subscriptions.deleteByDeviceToken).toHaveBeenCalledWith(expectedDeviceToken, expectedOptions);
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

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.subscriptions.deleteByDeviceToken().
        api.bitcoin.subscriptions.deleteByDeviceToken.mockImplementationOnce(() => Promise.reject(
          new Error('4cf14584-7bcd-43b2-a182-33b6b18a2beb')
        ));

        promise = unsubscribe()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('4cf14584-7bcd-43b2-a182-33b6b18a2beb');
        });
      });

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE,
            error
          });
        });
      });
    });
  });
});
