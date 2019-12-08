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
  return jest.fn(() => Promise.resolve('chicken approve topic suit shiver party whale holiday pitch source angry naive'));
});

jest.mock('../../../../../../src/clients/api', () => ({
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
      .then(({ inputs, outputs }) => {
        return signTransaction(inputs, outputs)(dispatchMock, getStateMock)
          .then((psbt) => {
            const transaction = psbt.extractTransaction();

            expect(transaction.toHex()).toBe(
              '02000000000102c07b385550902a79cf9cd134eef88c684b2d9a20e6dbfe9324113035035181260000000017160014bac5f056525e0936bc4f7fe8e6f39c16e5281ea6ffffffffd7a27f24ba7417cf69c6d33b7e622fa53f06366d724f08a903938d510cb48a170000000017160014c24b9b9b8ff0731cd9319fde80cbcae94d2acc8effffffff0120a107000000000017a914c1c06d739d229807df17d481fc9281428fabfca3870247304402200a1260d0fab26628b06b75a6cdabb92044ceb00a1dcb6a89918cdfa645c028770220713bbd87d27090009d1a40349af8fe931bb4bbee985f178edb2532397035a7fa012103d4de57529afadc2e60612775336119dfe498643c54a77c05d958bbe405c105c902483045022100a85754333ac601ab3f449279e46565d834e3325f3a7259b05466d3383786b7c302207b354a5b3fddb68b75714cc404602a11421abc459c1217f260ed6ff1e5bb5e03012102dc84e0bec4caeb22b3a808294f2edf4713b3129ebfe1b418ff4e469aeb0b752000000000'
            );
          });
      });
  });
});
