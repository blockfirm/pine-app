import {
  findAll,
  BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_REQUEST,
  BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_SUCCESS,
  BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_FAILURE
} from '../../../../../../src/actions/bitcoin/blockchain/addresses/findAll';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({
      settings: {
        api: {
          baseUrl: 'bcec9c48-582e-4cb0-a176-f797a5302d50'
        },
        bitcoin: {
          network: 'testnet'
        }
      }
    }));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '0b8eb91d-9c42-4fb0-8c5b-45009727a58d'
    },
    bitcoin: {
      network: 'testnet'
    }
  },
  keys: {
    items: {
      '83d1e71d-8934-4005-b926-ce8596cba7dd': {
        accountPublicKey: 'xpub6D3W2Tmr2rSzPUSCf3ijRcn25GFcu4ZKxBAxzDDTNFscjcYRWU4EiMXhUZ8xfkwc25y7zPK5VHPAqS4SVvdrmMbKp87rveinkNNcdny3Hvf'
      }
    }
  }
}));

jest.mock('../../../../../../src/actions/bitcoin/blockchain/transactions/getByAddress', () => ({
  getByAddress: (addresses) => {
    if (addresses.includes('2NDcDTtA9ZeDZMbC861c6zHB2BL92eGCj9Z')) {
      // Mocking batch 1.
      return () => Promise.resolve({
        '2NDcDTtA9ZeDZMbC861c6zHB2BL92eGCj9Z': [],
        '2N4kDxj2zLTm4xqqph8fQmtMgoK8DK9EugX': [
          {
            txid: '268b0e2f1c4f29d8aacf81d6581507cd1b0e4019f01e820fa9d799596084bcba'
          },
          {
            txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc'
          },
          {
            txid: 'a25368e98b7c735a32a3f1a5eae51d4aa521c06b5e5864e402805c7bc4909713'
          }
        ],
        '2MzqAPaeZpovcGK6kky9bXruW46SARvKWfh': [],
        '2NDe2kwveh29Wzt5J11m8Yz1DMaWaFnqbjq': [],
        '2N4riAkgBNfMEpBbWYm8L7wiaR8yHMX9pwK': [
          {
            txid: 'b2f4cefaf86ef18bcad2763efbd53d95b94973b5eb03045e3351b5d18286c26b'
          },
          {
            txid: '90fb1fc847f6495f917c692404ac9a2128fe327cf8b6efeb0187fca5b8fa225f'
          }
        ],
        '2MzykPH8BfaTbyPNm2LDYUCLwMCCF2YNZ6Q': [],
        '2NDF2Ro8dojDhuqDv397gkdCsUDNXCAM4JW': [],
        '2N5xUixrze7tZrBTGJB8NKe5zBHx2ytX7xD': [],
        '2NBjAAH919RPXYZ1trqAGWLSrnKdRzn6DCR': [],
        '2Mz3uxpD9r5shF2Vj38GJpRuHNH9MfJYVaU': []
      });
    }

    if (addresses.includes('2MwKrKevwkT8FCrnXg6AfGVMhSjATmrb9AP')) {
      // Mocking batch 2.
      return () => Promise.resolve({
        '2MwKrKevwkT8FCrnXg6AfGVMhSjATmrb9AP': [],
        '2N7FCcGzz1jZtt5gGAo2hTsg3wqb7ZfsTod': [],
        '2N16xmu4AT7CcapEB1o5Bb41VXydAfwFLpn': [],
        '2MxNSMcQW3bRFVmqSXE2boyaeM4oFtNMQ3b': [],
        '2NCehXHMbHi6E3yrMa3VgtHmFsZpFVNukJg': [],
        '2N8uBbChcZ1K444nbXBQNcuxt8SSN1Fvs8U': [],
        '2NF2F5DmfJL8wSx1xTLRG5CrfL1FoJfZSx1': [],
        '2NCpjFUo3dfQheBHbF1MjNark9UcCrwJZd9': [],
        '2Mw8JPWPrdNQ7NPXvQ3ULhcR6wx51ZuW25c': [],
        '2MzKfHq18FVQewtZFCKYQ9psdWCjDSrfo6v': []
      });
    }

    if (addresses.includes('2NGKotZSjYHwdPLye2cLZst1xxtJYzLyQyH')) {
      // Mocking batch 3.
      return () => Promise.resolve({
        '2NGKotZSjYHwdPLye2cLZst1xxtJYzLyQyH': [],
        '2Musqtac8yBaqJawBaYRCqXujsGktK1ryMK': [],
        '2N8nHWNaBniUgnUnexuYmqiGqKCeW6jc1Q7': [],
        '2MwMPpadUFbGjXG3fJByy3rq4EZqibXfnnr': [],
        '2Mz7i8B2m4zatuU1LNkQysZPprrxodc2nZs': [],
        '2MyMKZQim4twZyjrKAkbDGpmFGLEX2hdcc1': [],
        '2MzQapxy4KbB1bvH87zhKuJu5bgU41QhA8L': [],
        '2N9U6nNmSVJVBhn6eGsEawvGiQaBLCM2njz': [],
        '2N3HPttK6KPXX6R2TnR3Dpr9h5mk4xh8ruy': [],
        '2N6xUB4mGBgE1ZUT9ccsPcqhUYwdBrd3epg': []
      });
    }
  }
}));

describe('BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_REQUEST', () => {
  it('equals "BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_REQUEST"', () => {
    expect(BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_REQUEST).toBe('BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_REQUEST');
  });
});

describe('BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_SUCCESS', () => {
  it('equals "BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_SUCCESS"', () => {
    expect(BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_SUCCESS).toBe('BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_SUCCESS');
  });
});

describe('BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_FAILURE', () => {
  it('equals "BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_FAILURE"', () => {
    expect(BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_FAILURE).toBe('BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_ALL_FAILURE');
  });
});

describe('findAll', () => {
  it('finds and returns all addresses with transactions for the account #0', () => {
    const expectedResult = [
      {
        address: '2NDcDTtA9ZeDZMbC861c6zHB2BL92eGCj9Z',
        transactions: []
      },
      {
        address: '2N4kDxj2zLTm4xqqph8fQmtMgoK8DK9EugX',
        transactions: [
          {
            txid: '268b0e2f1c4f29d8aacf81d6581507cd1b0e4019f01e820fa9d799596084bcba'
          },
          {
            txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc'
          },
          {
            txid: 'a25368e98b7c735a32a3f1a5eae51d4aa521c06b5e5864e402805c7bc4909713'
          }
        ]
      },
      {
        address: '2MzqAPaeZpovcGK6kky9bXruW46SARvKWfh',
        transactions: []
      },
      {
        address: '2NDe2kwveh29Wzt5J11m8Yz1DMaWaFnqbjq',
        transactions: []
      },
      {
        address: '2N4riAkgBNfMEpBbWYm8L7wiaR8yHMX9pwK',
        transactions: [
          {
            txid: 'b2f4cefaf86ef18bcad2763efbd53d95b94973b5eb03045e3351b5d18286c26b'
          },
          {
            txid: '90fb1fc847f6495f917c692404ac9a2128fe327cf8b6efeb0187fca5b8fa225f'
          }
        ]
      }
    ];

    return findAll()(dispatchMock, getStateMock).then((addresses) => {
      expect(addresses).toMatchObject(expectedResult);
    });
  });
});
