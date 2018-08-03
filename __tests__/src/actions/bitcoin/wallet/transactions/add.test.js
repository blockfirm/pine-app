import {
  add as addTransactions,
  BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS
} from '../../../../../../src/actions/bitcoin/wallet/transactions/add';

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

describe('BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS).toBe('BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS');
  });
});

describe('add', () => {
  let fakeTransactions;

  beforeEach(() => {
    fakeTransactions = [
      { txid: '73ee2181-d1a7-4292-9999-2b28ef9289fb' },
      { txid: '21eaf1eb-aaef-466e-8b49-b05842d6056f' },
      { txid: '9a9d5ac6-22b9-4688-b442-6afeb3414768' }
    ];
  });

  it('is a function', () => {
    expect(typeof addTransactions).toBe('function');
  });

  it('accepts one argument', () => {
    expect(addTransactions.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = addTransactions(fakeTransactions);
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS with the transactions', () => {
    addTransactions(fakeTransactions)(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS,
      transactions: fakeTransactions
    });
  });

  it('resolves to the passed transactions', () => {
    expect.hasAssertions();

    return addTransactions(fakeTransactions)(dispatchMock).then((transactions) => {
      expect(transactions).toBe(fakeTransactions);
    });
  });

  it('saves the state', () => {
    addTransactions(fakeTransactions)(dispatchMock);
    expect(saveTransactions).toHaveBeenCalled();
  });
});
