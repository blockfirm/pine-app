import * as api from '../../../../../../src/clients/api';

import {
  get,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE
} from '../../../../../../src/actions/bitcoin/blockchain/transactions/get';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '4527ccd6-e9cd-4ad4-98a9-2002c7d90255'
    }
  }
}));

jest.mock('../../../../../../src/clients/api', () => ({
  bitcoin: {
    transactions: {
      get: jest.fn(() => Promise.resolve('c942a2aa-a81b-4e64-ac56-1ee80177785c'))
    }
  }
}));

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST');
  });
});

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS');
  });
});

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE');
  });
});

describe('get', () => {
  let addresses;
  let page;
  let pageSize;
  let reverse;

  beforeEach(() => {
    addresses = [
      'ee8eed41-a60a-468b-82cb-380f2ed05e1f',
      '4a7c8a53-6be0-47c3-8afc-d2d3ddbaa1fd'
    ];

    page = 1;
    pageSize = 100;
    reverse = false;

    api.bitcoin.transactions.get.mockClear();
  });

  it('is a function', () => {
    expect(typeof get).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(get.length).toBe(2);
  });

  it('returns a function', () => {
    const returnValue = get(addresses, page, pageSize, reverse);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = get(addresses, page, pageSize, reverse);
    });

    it('dispatches an action of type BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST
      });
    });

    it('gets the transactions with api.bitcoin.transactions.get() together with baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: '4527ccd6-e9cd-4ad4-98a9-2002c7d90255'
        };

        expect(api.bitcoin.transactions.get).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.transactions.get).toHaveBeenCalledWith(addresses, page, pageSize, reverse, expectedOptions);
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

      it('dispatches an action of type BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS with the result from api.bitcoin.transactions.get()', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS,
            transactions: 'c942a2aa-a81b-4e64-ac56-1ee80177785c'
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.transactions.get().
        api.bitcoin.transactions.get.mockImplementationOnce(() => Promise.reject(
          new Error('9f6c19c9-b7ac-433a-be2b-cbc194e06d8c')
        ));

        promise = get(addresses, page, pageSize, reverse)(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('9f6c19c9-b7ac-433a-be2b-cbc194e06d8c');
        });
      });

      it('dispatches an action of type BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE,
            error
          });
        });
      });
    });
  });
});
