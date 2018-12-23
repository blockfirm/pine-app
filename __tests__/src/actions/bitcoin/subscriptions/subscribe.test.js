import * as api from '../../../../../src/api';

import {
  subscribe,
  BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST,
  BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS,
  BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE
} from '../../../../../src/actions/bitcoin/subscriptions/subscribe';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: 'c9ac232e-c24e-4064-8a6b-26f9881c316e'
    }
  }
}));

jest.mock('../../../../../src/api', () => ({
  bitcoin: {
    subscriptions: {
      post: jest.fn(() => Promise.resolve())
    }
  }
}));

describe('BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST).toBe('BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS).toBe('BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS');
  });
});

describe('BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE', () => {
  it('equals "BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE"', () => {
    expect(BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE).toBe('BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE');
  });
});

describe('subscribe', () => {
  let fakeDeviceToken;
  let fakeAddresses;

  beforeEach(() => {
    fakeDeviceToken = '43e53b6d-e298-4404-9672-303357873330';

    fakeAddresses = [
      'bc2c7948-fb6f-493e-a405-8c3c14d996f4',
      '323c00ae-c181-414d-b19f-a9c6a39b733f',
      'a479ba8b-0a0d-4c05-8fe8-a647cfcfc2be'
    ];

    api.bitcoin.subscriptions.post.mockClear();
  });

  it('is a function', () => {
    expect(typeof subscribe).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = subscribe();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = subscribe(fakeDeviceToken, fakeAddresses);
    });

    it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST
      });
    });

    it('subscribes the addresses with api.bitcoin.subscriptions.post()', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: 'c9ac232e-c24e-4064-8a6b-26f9881c316e'
        };

        expect(api.bitcoin.subscriptions.post).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.subscriptions.post).toHaveBeenCalledWith(fakeDeviceToken, fakeAddresses, expectedOptions);
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

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.subscriptions.post().
        api.bitcoin.subscriptions.post.mockImplementationOnce(() => Promise.reject(
          new Error('3fcd554c-43f8-4666-97a1-73f3881282a3')
        ));

        promise = subscribe(fakeDeviceToken, fakeAddresses)(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('3fcd554c-43f8-4666-97a1-73f3881282a3');
        });
      });

      it('dispatches an action of type BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE,
            error
          });
        });
      });
    });
  });

  describe('when given more than 1000 addresses', () => {
    it('subscribes the addresses in chunks of 1000', () => {
      const manyAddresses = [];

      for (let index = 0; index < 1300; index++) {
        manyAddresses.push(`address-${index}`);
      }

      expect.hasAssertions();

      return subscribe(fakeDeviceToken, manyAddresses)(dispatchMock, getStateMock)
        .then(() => {
          const firstChunk = manyAddresses.slice(0, 1000);
          const secondChunk = manyAddresses.slice(1000, 1300);

          expect(api.bitcoin.subscriptions.post).toHaveBeenCalledTimes(2);
          expect(api.bitcoin.subscriptions.post).toHaveBeenCalledWith(fakeDeviceToken, firstChunk, expect.any(Object));
          expect(api.bitcoin.subscriptions.post).toHaveBeenCalledWith(fakeDeviceToken, secondChunk, expect.any(Object));
        });
    });
  });
});
