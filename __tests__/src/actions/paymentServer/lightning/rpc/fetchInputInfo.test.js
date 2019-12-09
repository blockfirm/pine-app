import {
  fetchInputInfo,
  PINE_LIGHTNING_RPC_FETCH_INPUT_INFO
} from '../../../../../../src/actions/paymentServer/lightning/rpc/fetchInputInfo';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action();
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  bitcoin: {
    wallet: {
      utxos: {
        items: [
          {
            value: 0.009,
            n: 0,
            scriptPubKey: {
              hex: 'a91487357fd1ebe10b7ab64db29c75ca9adc2162d47187'
            },
            txid: '3d0791455f05576af4d32853c7d2ec4e47eb069d0d601a703fab41f47d2840ac',
            confirmations: 0
          },
          {
            value: 0.008,
            n: 0,
            scriptPubKey: {
              hex: 'a9142dbf3ecfecb55f5eb2f8817c58f91b37db4ac3c187'
            },
            txid: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
            confirmations: 73
          },
          {
            value: 1e-8,
            n: 0,
            scriptPubKey: {
              hex: 'a91425f03e103fc97710063e9c22c613adcde4026cab87'
            },
            txid: 'c8f9161d0b72a715af37147388984042abee8d8b52fbccb59c77025198093f40',
            confirmations: 3
          }
        ]
      }
    }
  }
}));

describe('PINE_LIGHTNING_RPC_FETCH_INPUT_INFO', () => {
  it('equals "PINE_LIGHTNING_RPC_FETCH_INPUT_INFO"', () => {
    expect(PINE_LIGHTNING_RPC_FETCH_INPUT_INFO).toBe('PINE_LIGHTNING_RPC_FETCH_INPUT_INFO');
  });
});

describe('fetchInputInfo', () => {
  it('is a function', () => {
    expect(typeof fetchInputInfo).toBe('function');
  });

  it('returns utxo info for the specified output', () => {
    const request = {
      hash: Buffer.from('3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a', 'hex'), // From the btcwallet mock.
      index: 0
    };

    const expectedResponse = {
      utxo: {
        addressType: 2,
        confirmations: 73,
        transactionHash: Buffer.from('3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a', 'hex'),
        pkScript: Buffer.from('a9142dbf3ecfecb55f5eb2f8817c58f91b37db4ac3c187', 'hex'),
        value: '800000',
        vout: 0
      }
    };

    expect.hasAssertions();

    return fetchInputInfo(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toMatchObject(expectedResponse);
    });
  });
});
