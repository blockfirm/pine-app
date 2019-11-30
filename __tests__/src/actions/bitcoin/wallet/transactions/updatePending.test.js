import {
  updatePending as updatePendingTransactions,
  BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST,
  BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS,
  BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/transactions/updatePending';

import { getByTxid as getTransactionByTxid } from '../../../../../../src/actions/bitcoin/blockchain/transactions/getByTxid';
import { save as saveTransactions } from '../../../../../../src/actions/bitcoin/wallet/transactions/save';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  bitcoin: {
    wallet: {
      transactions: {
        items: [
          { txid: 'c00710fd-4705-4386-b838-d4c2f2786cf4', confirmations: 0 },
          { txid: '7ca5331b-2faf-4673-8c7c-5e9b57d6dc71', confirmations: 2 },
          { txid: '96c3c063-46fe-4f30-b702-643b06d8e0ec', confirmations: 7 },
          { txid: 'b67768f4-ae20-4515-9fac-17aee6f5c360', confirmations: null },
          { txid: '1220e957-3769-4cdb-b9d2-a810b2956040', confirmations: 1 },
          { txid: 'aca467b9-d000-4ba6-aaa4-fd5a3ef564e2', confirmations: 6 }
        ]
      }
    }
  }
}));

// Transactions with less than 6 confirmations.
const transactionsToUpdate = [
  { txid: 'c00710fd-4705-4386-b838-d4c2f2786cf4', confirmations: 0 },
  { txid: '7ca5331b-2faf-4673-8c7c-5e9b57d6dc71', confirmations: 2 },
  { txid: 'b67768f4-ae20-4515-9fac-17aee6f5c360', confirmations: null },
  { txid: '1220e957-3769-4cdb-b9d2-a810b2956040', confirmations: 1 }
];

jest.mock('../../../../../../src/actions/bitcoin/blockchain/transactions/getByTxid', () => ({
  getByTxid: jest.fn((txid) => Promise.resolve({ txid }))
}));

jest.mock('../../../../../../src/actions/bitcoin/wallet/transactions/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST).toBe('BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS).toBe('BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE).toBe('BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE');
  });
});

describe('updatePending', () => {
  beforeEach(() => {
    getTransactionByTxid.mockClear();
  });

  it('is a function', () => {
    expect(typeof updatePendingTransactions).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(updatePendingTransactions.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = updatePendingTransactions();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST', () => {
    updatePendingTransactions()(dispatchMock, getStateMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST
    });
  });

  it('calls getTransactionByTxid() for each transaction in state with less than 6 confirmations', () => {
    expect.hasAssertions();

    return updatePendingTransactions()(dispatchMock, getStateMock).then(() => {
      expect(getTransactionByTxid).toHaveBeenCalledTimes(transactionsToUpdate.length);

      transactionsToUpdate.forEach((unconfirmedTransaction) => {
        expect(getTransactionByTxid).toHaveBeenCalledWith(unconfirmedTransaction.txid);
      });
    });
  });

  it('resolves to the updated transactions', () => {
    expect.hasAssertions();

    return updatePendingTransactions()(dispatchMock, getStateMock).then((transactions) => {
      // The getTransactionByTxid() mock will return an object with the txid.
      expect(transactions).toEqual(expect.arrayContaining([
        { txid: 'c00710fd-4705-4386-b838-d4c2f2786cf4' },
        { txid: '7ca5331b-2faf-4673-8c7c-5e9b57d6dc71' },
        { txid: 'b67768f4-ae20-4515-9fac-17aee6f5c360' },
        { txid: '1220e957-3769-4cdb-b9d2-a810b2956040' }
      ]));
    });
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS with the updated transactions', () => {
    expect.hasAssertions();

    return updatePendingTransactions()(dispatchMock, getStateMock).then((transactions) => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS,
        transactions
      });
    });
  });

  it('saves the state', () => {
    expect.hasAssertions();

    return updatePendingTransactions()(dispatchMock, getStateMock).then(() => {
      expect(saveTransactions).toHaveBeenCalled();
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      // Make the function fail by returning a rejected promise from getTransactionByTxid().
      getTransactionByTxid.mockImplementationOnce(() => Promise.reject(
        new Error('ee6d692d-fc54-4eb2-8210-b1889869b94e')
      ));

      promise = updatePendingTransactions()(dispatchMock, getStateMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('ee6d692d-fc54-4eb2-8210-b1889869b94e');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE,
          error
        });
      });
    });
  });
});
