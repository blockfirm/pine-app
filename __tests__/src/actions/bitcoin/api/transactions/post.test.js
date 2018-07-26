import * as api from '../../../../../../src/api';

import {
  post,
  BITCOIN_API_TRANSACTIONS_POST_REQUEST,
  BITCOIN_API_TRANSACTIONS_POST_SUCCESS,
  BITCOIN_API_TRANSACTIONS_POST_FAILURE
} from '../../../../../../src/actions/bitcoin/api/transactions/post';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '2029bfb0-313f-4969-95fe-98e3d710b047'
    }
  }
}));

jest.mock('../../../../../../src/api', () => ({
  bitcoin: {
    transactions: {
      post: jest.fn(() => Promise.resolve())
    }
  }
}));

describe('BITCOIN_API_TRANSACTIONS_POST_REQUEST', () => {
  it('equals "BITCOIN_API_TRANSACTIONS_POST_REQUEST"', () => {
    expect(BITCOIN_API_TRANSACTIONS_POST_REQUEST).toBe('BITCOIN_API_TRANSACTIONS_POST_REQUEST');
  });
});

describe('BITCOIN_API_TRANSACTIONS_POST_SUCCESS', () => {
  it('equals "BITCOIN_API_TRANSACTIONS_POST_SUCCESS"', () => {
    expect(BITCOIN_API_TRANSACTIONS_POST_SUCCESS).toBe('BITCOIN_API_TRANSACTIONS_POST_SUCCESS');
  });
});

describe('BITCOIN_API_TRANSACTIONS_POST_FAILURE', () => {
  it('equals "BITCOIN_API_TRANSACTIONS_POST_FAILURE"', () => {
    expect(BITCOIN_API_TRANSACTIONS_POST_FAILURE).toBe('BITCOIN_API_TRANSACTIONS_POST_FAILURE');
  });
});

describe('post', () => {
  let fakeTransaction;

  beforeEach(() => {
    fakeTransaction = {
      txid: 'f91c6df1-140e-4efd-8dcd-4edd390dc70f'
    };

    api.bitcoin.transactions.post.mockClear();
  });

  it('is a function', () => {
    expect(typeof post).toBe('function');
  });

  it('accepts one argument', () => {
    expect(post.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = post(fakeTransaction);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = post(fakeTransaction);
    });

    it('dispatches an action of type BITCOIN_API_TRANSACTIONS_POST_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_API_TRANSACTIONS_POST_REQUEST
      });
    });

    it('posts the transaction with api.bitcoin.transactions.post() together with baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: '2029bfb0-313f-4969-95fe-98e3d710b047'
        };

        expect(api.bitcoin.transactions.post).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.transactions.post).toHaveBeenCalledWith(fakeTransaction, expectedOptions);
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

      it('dispatches an action of type BITCOIN_API_TRANSACTIONS_POST_SUCCESS with the transaction', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_API_TRANSACTIONS_POST_SUCCESS,
            transaction: fakeTransaction
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.transactions.post().
        api.bitcoin.transactions.post.mockImplementationOnce(() => Promise.reject(
          new Error('ca35dd1e-d1dd-41c7-88f3-ae4f64fd62a5')
        ));

        promise = post()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('ca35dd1e-d1dd-41c7-88f3-ae4f64fd62a5');
        });
      });

      it('dispatches an action of type BITCOIN_API_TRANSACTIONS_POST_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_API_TRANSACTIONS_POST_FAILURE,
            error
          });
        });
      });
    });
  });
});
