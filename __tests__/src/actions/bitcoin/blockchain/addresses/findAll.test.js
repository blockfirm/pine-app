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
        accountPublicKey: 'tpubDC2a57BzvgwVs96UHSEiMPwyr4gr7FDr6GoypR5zZVJoVtdFNW6DUiwATjxyybVUJm3gk2TS87vAPiwJ7LnXuQSLjhthdihQgruQGiPvxfK'
      }
    }
  }
}));

jest.mock('../../../../../../src/actions/bitcoin/blockchain/transactions/getByAddress', () => ({
  getByAddress: (addresses) => {
    if (addresses.includes('2NAugvQayt9ep51HVNUfhTNoBNh2pwPTkda')) {
      // Mocking batch 1.
      return () => Promise.resolve({
        '2NAugvQayt9ep51HVNUfhTNoBNh2pwPTkda': [],
        '2MvzGBQU8VKUR8S4sLLoNFZCamRbU9j98Lp': [
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
        '2NCb7CgGzagDd2gYrLSkQJ12KScRLmF5qui': [],
        '2N33fkFcadztWij1HYYGVHJRoRAn6BwLYns': [],
        '2MtWpuXrUEWah6ufhCZ5wQMqtpncbv4B68C': [
          {
            txid: 'b2f4cefaf86ef18bcad2763efbd53d95b94973b5eb03045e3351b5d18286c26b'
          },
          {
            txid: '90fb1fc847f6495f917c692404ac9a2128fe327cf8b6efeb0187fca5b8fa225f'
          }
        ],
        '2NDzw4VZGQTEsD3qdnq56URDgQvhJEW4wRK': [],
        '2NDWtmRDAjY4dQfWcWa9a7JRwK7XvcndMqu': [],
        '2NGaFo1q4GQoV3XDsQsuFuiyrCyDicgpeDE': [],
        '2N3Dde4teCAKiGC6v3CirgtwcmehAoesazA': [],
        '2NE2ZEYBfkKP7rTVMz1vHxNTPoXBYGnLV5U': []
      });
    }

    if (addresses.includes('2Mz4sKWj1Qh8DVVtfBEB7fwKTcfCU1PaSUw')) {
      // Mocking batch 2.
      return () => Promise.resolve({
        '2Mz4sKWj1Qh8DVVtfBEB7fwKTcfCU1PaSUw': [],
        '2NCfL1KZTHGCtP9WgdEh8e7wPbwvfSJW7F9': [],
        '2MwR7Vsp9NFpYDGspkEiLGK444hCyRABCb1': [],
        '2N5a9JNqjtFySvYUu58wiLeR4pZKBKorhQA': [],
        '2N9Sksig8TvDVz6EoNFJBjiP2uQEDWpFNWw': [],
        '2MsgCzjRADsMeg5mKx9vnbX7Wzsb8dmMJqR': [],
        '2NDN2e59LcDYsHnWuji1DMvrnXFctE7f7Bi': [],
        '2Mvhpnie4FpYC56KdmZwB75R97ZTLEAwzG4': [],
        '2N8gy924tCcjx84LkPMNw5tPoSLfwpfy7KG': [],
        '2N2UV4NhedvuU6ELFiwVNEyz9SvGJFCqNfo': []
      });
    }

    if (addresses.includes('2NDUYgX2otd8D149TCTjbLs1BnPTxzXrpHH')) {
      // Mocking batch 3.
      return () => Promise.resolve({
        '2NDUYgX2otd8D149TCTjbLs1BnPTxzXrpHH': [],
        '2NAJ1JqVtTQUuQdA1imxSBfNXv9EqviwKW4': [],
        '2MuRybnHChiYtDRZYG8WLgMPZiWSGeg6w8v': [],
        '2N7sHCnhtBmTJaFUCqNF4GA3ket2uUcRr3L': [],
        '2MtJJusPP7NZCjeX7W5r8nh3nv6u8XA8xRZ': [],
        '2N3f1u1cgio7DpuT1KMFj8qtXdLy3qpjAKb': [],
        '2N8jRUctA3qDLc7z8zYqaei7mZTrZjRaHfv': [],
        '2N6V4qu9fk7mv6hFi1rLStJ8LFikp4Wmjqv': [],
        '2N6coJyFEXrCoGnF3X6jPShMQe3vStETLGi': [],
        '2NACJy9AkmmFHj9Ukx9LZ5upstLJEVfrnAq': []
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
        address: '2NAugvQayt9ep51HVNUfhTNoBNh2pwPTkda',
        transactions: []
      },
      {
        address: '2MvzGBQU8VKUR8S4sLLoNFZCamRbU9j98Lp',
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
        address: '2NCb7CgGzagDd2gYrLSkQJ12KScRLmF5qui',
        transactions: []
      },
      {
        address: '2N33fkFcadztWij1HYYGVHJRoRAn6BwLYns',
        transactions: []
      },
      {
        address: '2MtWpuXrUEWah6ufhCZ5wQMqtpncbv4B68C',
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
