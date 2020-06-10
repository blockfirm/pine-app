import {
  listUnspentWitness,
  PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS
} from '../../../../../src/actions/lightning/rpc/listUnspentWitness';

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
            confirmations: 0,
            reserved: false
          },
          {
            value: 0.008,
            n: 0,
            scriptPubKey: {
              hex: 'a9142dbf3ecfecb55f5eb2f8817c58f91b37db4ac3c187'
            },
            txid: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
            confirmations: 73,
            reserved: false
          },
          {
            value: 2.3852,
            n: 1,
            scriptPubKey: {
              hex: 'a91425f03e103fc97710063e9c22c613adcde4026cab87'
            },
            txid: 'c8f9161d0b72a715af37147388984042abee8d8b52fbccb59c77025198093f40',
            confirmations: 3,
            reserved: false
          },
          {
            value: 0.24,
            n: 0,
            scriptPubKey: {
              hex: 'a914a9684e5d8c3b3f4ea679186fb0f3773621a5dcb887'
            },
            txid: '7cdeec3f85c8dfc1c319ed53bcc8b9aeace200bd6b2ce040efb6a8f63597bc64',
            confirmations: 283,
            reserved: true
          }
        ]
      }
    }
  }
}));

describe('PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS', () => {
  it('equals "PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS"', () => {
    expect(PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS).toBe('PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS');
  });
});

describe('listUnspentWitness', () => {
  it('is a function', () => {
    expect(typeof listUnspentWitness).toBe('function');
  });

  it('returns unreserved utxos with minimum confirmations', () => {
    const request = {
      minConfirmations: 3,
      maxConfirmations: null
    };

    const expectedResponse = {
      utxos: [
        {
          addressType: 2,
          confirmations: 73,
          transactionHash: Buffer.from('3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a', 'hex'),
          pkScript: Buffer.from('a9142dbf3ecfecb55f5eb2f8817c58f91b37db4ac3c187', 'hex'),
          value: '800000',
          vout: 0
        },
        {
          addressType: 2,
          confirmations: 3,
          transactionHash: Buffer.from('403f09985102779cb5ccfb528b8deeab42409888731437af15a7720b1d16f9c8', 'hex'),
          pkScript: Buffer.from('a91425f03e103fc97710063e9c22c613adcde4026cab87', 'hex'),
          value: '238520000',
          vout: 1
        }
      ]
    };

    expect.hasAssertions();

    return listUnspentWitness(request)(dispatchMock, getStateMock).then(response => {
      expect(response).toBeTruthy();
      expect(Array.isArray(response.utxos)).toBe(true);

      response.utxos.forEach((utxo, index) => {
        const expectedUtxo = expectedResponse.utxos[index];

        expect(utxo.addressType).toBe(expectedUtxo.addressType);
        expect(utxo.confirmations).toBe(expectedUtxo.confirmations);
        expect(utxo.transactionHash.equals(expectedUtxo.transactionHash)).toBe(true);
        expect(utxo.pkScript.equals(expectedUtxo.pkScript)).toBe(true);
        expect(utxo.value).toBe(expectedUtxo.value);
        expect(utxo.vout).toBe(expectedUtxo.vout);
      });
    });
  });
});
