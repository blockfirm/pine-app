import {
  removeAll as removeAllTransactions,
  BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS
} from '../../../../../../src/actions/bitcoin/wallet/transactions/removeAll';

import { save as saveTransactions } from '../../../../../../src/actions/bitcoin/wallet/transactions/save';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../../../src/actions/bitcoin/wallet/transactions/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS).toBe('BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS');
  });
});

describe('removeAll', () => {
  it('is a function', () => {
    expect(typeof removeAllTransactions).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(removeAllTransactions.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = removeAllTransactions();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS', () => {
    removeAllTransactions()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS
    });
  });

  it('saves the state', () => {
    removeAllTransactions()(dispatchMock);
    expect(saveTransactions).toHaveBeenCalled();
  });
});
