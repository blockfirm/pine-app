import {
  create as createTransaction,
  BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST,
  BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS,
  BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE
} from '../../../../../../src/actions/bitcoin/wallet/transactions/create';

import { getEstimate as getFeeEstimate } from '../../../../../../src/actions/bitcoin/fees/getEstimate';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({
      settings: {
        bitcoin: {
          network: 'mainnet'
        }
      }
    }));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    bitcoin: {
      network: 'mainnet',
      fee: {
        numberOfBlocks: 6
      }
    }
  },
  bitcoin: {
    wallet: {
      utxos: {
        items: [
          {
            txid: '268b0e2f1c4f29d8aacf81d6581507cd1b0e4019f01e820fa9d799596084bcba',
            n: 0,
            value: 0.5729,
            scriptPubKey: {
              addresses: ['2MvzGBQU8VKUR8S4sLLoNFZCamRbU9j98Lp']
            },
            confirmed: false,
            internal: true
          },
          {
            txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc',
            n: 0,
            value: 0.9183,
            scriptPubKey: {
              addresses: ['2MtWpuXrUEWah6ufhCZ5wQMqtpncbv4B68C']
            },
            confirmed: true,
            internal: true
          },
          {
            txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc',
            n: 1,
            value: 0.0283,
            scriptPubKey: {
              addresses: ['2MtWpuXrUEWah6ufhCZ5wQMqtpncbv4B68C']
            },
            confirmed: true,
            internal: false
          },
          {
            txid: 'cf96bc613bacf72b21277c5524cb010cba5afda6204c486dcd947b5aa007bda3',
            n: 0,
            value: 1.5195,
            scriptPubKey: {
              addresses: ['mzQQ9EFnPit8a2aW1bDkn72AhXmpUSL7Vi']
            },
            confirmed: false,
            internal: false
          }
        ]
      },
      addresses: {
        internal: {
          unused: '15KDN6U7TkGub1pYEMKewMgXGQzoQSdHyQ',
          items: {
            '15KDN6U7TkGub1pYEMKewMgXGQzoQSdHyQ': {}
          }
        }
      }
    }
  }
}));

jest.mock('../../../../../../src/actions/bitcoin/fees/getEstimate', () => ({
  getEstimate: jest.fn(() => Promise.resolve(3))
}));

describe('BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST).toBe('BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS).toBe('BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS');
  });
});

describe('BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE', () => {
  it('equals "BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE"', () => {
    expect(BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE).toBe('BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE');
  });
});

describe('create', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
    getFeeEstimate.mockClear();
  });

  it('returns the outputs for the transaction', () => {
    const amountBtc = 1.15;
    const toAddress = '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse';

    expect.hasAssertions();

    return createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock)
      .then(({ outputs }) => {
        const expectedOutputs = [
          {
            address: '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse', // To address
            value: 115000000
          },
          {
            address: '15KDN6U7TkGub1pYEMKewMgXGQzoQSdHyQ', // Change address
            value: 34118884
          }
        ];

        expect(outputs).toMatchObject(expectedOutputs);
      });
  });

  it('returns the inputs for the transaction', () => {
    const amountBtc = 1.15;
    const toAddress = '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse';

    expect.hasAssertions();

    return createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock)
      .then(({ inputs }) => {
        const expectedInputs = [
          {
            addresses: [
              '2MtWpuXrUEWah6ufhCZ5wQMqtpncbv4B68C'
            ],
            txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc',
            value: 91830000,
            vout: 0
          },
          {
            addresses: [
              '2MvzGBQU8VKUR8S4sLLoNFZCamRbU9j98Lp'
            ],
            txid: '268b0e2f1c4f29d8aacf81d6581507cd1b0e4019f01e820fa9d799596084bcba',
            value: 57290000,
            vout: 0
          }
        ];

        expect(inputs).toMatchObject(expectedInputs);
      });
  });

  it('returns the final fee', () => {
    const amountBtc = 1.15;
    const toAddress = '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse';

    expect.hasAssertions();

    return createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock)
      .then(({ fee }) => {
        expect(fee).toBe(1116);
      });
  });

  describe('when there is not enough funds to pay the transaction fee', () => {
    it('returns inputs, outputs, and fee as undefined', () => {
      const amountBtc = 1.5195;
      const toAddress = '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse';

      expect.hasAssertions();

      return createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock)
        .then(({ inputs, outputs, fee }) => {
          expect(inputs).toBeUndefined();
          expect(outputs).toBeUndefined();
          expect(fee).toBeUndefined();
        });
    });
  });

  describe('when the function fails', () => {
    let promise;

    beforeEach(() => {
      const amountBtc = 0.98;
      const toAddress = '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse';

      // Make the function fail by returning a rejected promise from getFeeEstimate().
      getFeeEstimate.mockImplementationOnce(() => Promise.reject(
        new Error('aec5b6f4-baf3-4a0c-b655-5c9d692bd1ab')
      ));

      promise = createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('aec5b6f4-baf3-4a0c-b655-5c9d692bd1ab');
      });
    });

    it('dispatches an action of type BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE,
          error
        });
      });
    });
  });
});
