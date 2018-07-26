import * as api from '../../../../src/api';

import {
  postTransaction,
  BITCOIN_POST_TRANSACTION_REQUEST,
  BITCOIN_POST_TRANSACTION_SUCCESS,
  BITCOIN_POST_TRANSACTION_FAILURE
} from '../../../../src/actions/bitcoin/postTransaction';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '2029bfb0-313f-4969-95fe-98e3d710b047'
    }
  }
}));

jest.mock('../../../../src/api', () => ({
  bitcoin: {
    transactions: {
      post: jest.fn(() => Promise.resolve())
    }
  }
}));

describe('BITCOIN_POST_TRANSACTION_REQUEST', () => {
  it('equals "BITCOIN_POST_TRANSACTION_REQUEST"', () => {
    expect(BITCOIN_POST_TRANSACTION_REQUEST).toBe('BITCOIN_POST_TRANSACTION_REQUEST');
  });
});

describe('BITCOIN_POST_TRANSACTION_SUCCESS', () => {
  it('equals "BITCOIN_POST_TRANSACTION_SUCCESS"', () => {
    expect(BITCOIN_POST_TRANSACTION_SUCCESS).toBe('BITCOIN_POST_TRANSACTION_SUCCESS');
  });
});

describe('BITCOIN_POST_TRANSACTION_FAILURE', () => {
  it('equals "BITCOIN_POST_TRANSACTION_FAILURE"', () => {
    expect(BITCOIN_POST_TRANSACTION_FAILURE).toBe('BITCOIN_POST_TRANSACTION_FAILURE');
  });
});

describe('postTransaction', () => {
  let fakeTransaction;

  beforeEach(() => {
    fakeTransaction = {
      txid: 'f91c6df1-140e-4efd-8dcd-4edd390dc70f'
    };

    api.bitcoin.transactions.post.mockClear();
  });

  it('is a function', () => {
    expect(typeof postTransaction).toBe('function');
  });

  it('accepts one argument', () => {
    expect(postTransaction.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = postTransaction(fakeTransaction);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = postTransaction(fakeTransaction);
    });

    it('dispatches an action of type BITCOIN_POST_TRANSACTION_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_POST_TRANSACTION_REQUEST
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

      it('dispatches an action of type BITCOIN_POST_TRANSACTION_SUCCESS with the transaction', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_POST_TRANSACTION_SUCCESS,
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

        promise = postTransaction()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('ca35dd1e-d1dd-41c7-88f3-ae4f64fd62a5');
        });
      });

      it('dispatches an action of type BITCOIN_POST_TRANSACTION_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_POST_TRANSACTION_FAILURE,
            error
          });
        });
      });
    });
  });
});
