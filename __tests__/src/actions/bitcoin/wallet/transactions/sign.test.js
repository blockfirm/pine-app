import { create as createTransaction } from '../../../../../../src/actions/bitcoin/wallet/transactions/create';

import {
  sign as signTransaction,
  BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST,
  BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS,
  BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/transactions/sign';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => require('./__fixtures__/state'));
  }

  return action;
});

const getStateMock = jest.fn(() => require('./__fixtures__/state'));

jest.mock('../../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('chicken approve topic suit shiver party whale holiday pitch source naive'));
});

jest.mock('../../../../../../src/api', () => ({
  bitcoin: {
    fees: {
      estimate: {
        get: jest.fn(() => Promise.resolve(4.7))
      }
    }
  }
}));

describe('BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST).toBe('BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS).toBe('BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE).toBe('BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE');
  });
});

describe('sign', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('signs a transaction', () => {
    const amountBtc = 0.005;
    const toAddress = '2NAugvQayt9ep51HVNUfhTNoBNh2pwPTkda';

    expect.hasAssertions();

    return createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock)
      .then(({ transaction, inputs }) => {
        return signTransaction(transaction, inputs)(dispatchMock, getStateMock)
          .then(() => {
            expect(transaction.signed).toBe(true);

            expect(() => {
              // This will fail if the transaction isn't signed.
              transaction.build().toHex();
            }).not.toThrow();
          });
      });
  });
});
