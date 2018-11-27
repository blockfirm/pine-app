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
      network: 'mainnet'
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
            }
          },
          {
            txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc',
            n: 0,
            value: 0.9183,
            scriptPubKey: {
              addresses: ['2MtWpuXrUEWah6ufhCZ5wQMqtpncbv4B68C']
            }
          },
          {
            txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc',
            n: 1,
            value: 0.0283,
            scriptPubKey: {
              addresses: ['2MtWpuXrUEWah6ufhCZ5wQMqtpncbv4B68C']
            }
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
  getEstimate: jest.fn(() => Promise.resolve(3.4))
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

  it('creates a transaction', () => {
    const amountBtc = 1.15;
    const toAddress = '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse';

    expect.hasAssertions();

    return createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock)
      .then(({ transaction }) => {
        const expectedTransaction = {
          __inputs: [{}, {}],
          __prevTxSet: {
            'babc84605999d7a90f821ef019400e1bcd071558d681cfaad8294f1c2f0e8b26:0': true,
            'bc51dd895145c904c71ac757eaa730af22d6eb06f25b63a87866d06c1ab1620d:0': true
          },
          __tx: {
            ins: [
              {
                hash: new Buffer([188, 81, 221, 137, 81, 69, 201, 4, 199, 26, 199, 87, 234, 167, 48, 175, 34, 214, 235, 6, 242, 91, 99, 168, 120, 102, 208, 108, 26, 177, 98, 13]),
                index: 0,
                script: new Buffer([]),
                sequence: 4294967295,
                witness: []
              },
              {
                hash: new Buffer([186, 188, 132, 96, 89, 153, 215, 169, 15, 130, 30, 240, 25, 64, 14, 27, 205, 7, 21, 88, 214, 129, 207, 170, 216, 41, 79, 28, 47, 14, 139, 38]),
                index: 0,
                script: new Buffer([]),
                sequence: 4294967295,
                witness: []
              }
            ],
            locktime: 0,
            outs: [
              {
                script: new Buffer([118, 169, 20, 32, 200, 197, 199, 165, 85, 97, 61, 148, 202, 130, 163, 205, 83, 196, 136, 58, 66, 115, 35, 136, 172]),
                value: 115000000
              },
              {
                script: new Buffer([118, 169, 20, 47, 82, 79, 166, 215, 8, 250, 11, 215, 180, 87, 78, 200, 15, 167, 10, 127, 159, 149, 30, 136, 172]),
                value: 34118884
              }
            ],
            version: 2
          },
          network: {
            bech32: 'bc',
            bip32: {
              private: 76066276,
              public: 76067358
            },
            pubKeyHash: 0,
            scriptHash: 5,
            wif: 128
          }
        };

        expect(transaction).toMatchObject(expectedTransaction);
      });
  });

  it('returns the inputs used to construct the transaction (to facilitate signing)', () => {
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
    it('returns transaction, inputs, and fee as undefined', () => {
      const amountBtc = 1.5195;
      const toAddress = '13zM94ayb5EU3raS3oiyMRoPtszMxj8zse';

      expect.hasAssertions();

      return createTransaction(amountBtc, toAddress)(dispatchMock, getStateMock)
        .then(({ transaction, inputs, fee }) => {
          expect(transaction).toBeUndefined();
          expect(inputs).toBeUndefined();
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
