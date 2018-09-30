import * as api from '../../../../../../src/api';

import {
  getByTxid,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE
} from '../../../../../../src/actions/bitcoin/blockchain/transactions/getByTxid';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '5af6e7db-ccee-4ab8-832e-2b28dba2b4fd'
    }
  }
}));

jest.mock('../../../../../../src/api', () => ({
  bitcoin: {
    transactions: {
      getByTxid: jest.fn(() => Promise.resolve({
        txid: '449328b9-bcf1-448d-8a0d-f752d6cb7fa5'
      }))
    }
  }
}));

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST');
  });
});

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS');
  });
});

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE');
  });
});

describe('getByTxid', () => {
  let txid;

  beforeEach(() => {
    txid = '1a80a023-455f-4318-83cc-5bf5408d0884';
    api.bitcoin.transactions.getByTxid.mockClear();
  });

  it('is a function', () => {
    expect(typeof getByTxid).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getByTxid.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = getByTxid(txid);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getByTxid(txid);
    });

    it('dispatches an action of type BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST
      });
    });

    it('gets the transaction with api.bitcoin.transactions.getByTxid(txid, options)', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: '5af6e7db-ccee-4ab8-832e-2b28dba2b4fd'
        };

        expect(api.bitcoin.transactions.getByTxid).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.transactions.getByTxid).toHaveBeenCalledWith(txid, expectedOptions);
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

      it('dispatches an action of type BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS with the transaction returned by the API', () => {
        // This fake transaction was mocked at the top.
        const expectedTransaction = {
          txid: '449328b9-bcf1-448d-8a0d-f752d6cb7fa5'
        };

        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS,
            transaction: expectedTransaction
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.transactions.getByTxid().
        api.bitcoin.transactions.getByTxid.mockImplementationOnce(() => Promise.reject(
          new Error('e63dee43-9064-4745-af60-64607f6e9f05')
        ));

        promise = getByTxid()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('e63dee43-9064-4745-af60-64607f6e9f05');
        });
      });

      it('dispatches an action of type BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE,
            error
          });
        });
      });
    });
  });
});
