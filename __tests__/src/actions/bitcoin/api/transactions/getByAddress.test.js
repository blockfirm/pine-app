import {
  getByAddress,
  BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST,
  BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS,
  BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE
} from '../../../../../../src/actions/bitcoin/api/transactions/getByAddress';

const dispatchMock = jest.fn((fn) => {
  if (typeof fn === 'function') {
    return fn(jest.fn(), () => ({
      settings: {
        api: {
          baseUrl: 'http://localhost:8080/v1'
        }
      }
    }));
  }
});

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '4527ccd6-e9cd-4ad4-98a9-2002c7d90255'
    }
  }
}));

jest.mock('../../../../../../src/actions/bitcoin/api/transactions/get', () => ({
  get: (addresses, page) => {
    if (page === 1) {
      // Mocking page 1.
      return () => Promise.resolve({
        '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx': [
          {
            txid: '67897dc5b16eeb470f72ee96b9654bc6c1d619a4cc81c49e5de98040ce617a58'
          },
          {
            txid: 'ff99ca25a672d05dc771c0dd53da3197950bbc848b870c0202a6948da7d523a6'
          },
          {
            txid: '59c51da961905a062eed4be58f5104993a268bfcd7838e9c9ad0952fb9c4c4c3'
          }
        ],
        'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx': [
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
      });
    }

    if (page === 2) {
      // Mocking page 2.
      return () => Promise.resolve({
        '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx': [],
        'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx': [
          {
            txid: 'a6bf3a81b5b28e81f0da1136fbdae9fdf4c9f0da75d322a4ad9f26bd47e1a82b'
          },
          {
            txid: '714a106960262007d3418ee58e0e3bd49d12dbcd031587f1bf5a2655a70fafae'
          }
        ]
      });
    }

    // Mocking page 3.
    return () => Promise.resolve({
      moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx: []
    });
  }
}));

describe('BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST', () => {
  it('equals "BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST"', () => {
    expect(BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST).toBe('BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_REQUEST');
  });
});

describe('BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS', () => {
  it('equals "BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS"', () => {
    expect(BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS).toBe('BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS');
  });
});

describe('BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE', () => {
  it('equals "BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE"', () => {
    expect(BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE).toBe('BITCOIN_API_TRANSACTIONS_GET_BY_ADDRESS_FAILURE');
  });
});

describe('getByAddress', () => {
  it('returns all transactions for the specified addresses', () => {
    const addresses = [
      '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx',
      'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx'
    ];

    const expectedResult = {
      '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx': [
        {
          txid: '67897dc5b16eeb470f72ee96b9654bc6c1d619a4cc81c49e5de98040ce617a58'
        },
        {
          txid: 'ff99ca25a672d05dc771c0dd53da3197950bbc848b870c0202a6948da7d523a6'
        },
        {
          txid: '59c51da961905a062eed4be58f5104993a268bfcd7838e9c9ad0952fb9c4c4c3'
        }
      ],
      'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx': [
        {
          txid: '268b0e2f1c4f29d8aacf81d6581507cd1b0e4019f01e820fa9d799596084bcba'
        },
        {
          txid: '0d62b11a6cd06678a8635bf206ebd622af30a7ea57c71ac704c9455189dd51bc'
        },
        {
          txid: 'a25368e98b7c735a32a3f1a5eae51d4aa521c06b5e5864e402805c7bc4909713'
        },
        {
          txid: 'a6bf3a81b5b28e81f0da1136fbdae9fdf4c9f0da75d322a4ad9f26bd47e1a82b'
        },
        {
          txid: '714a106960262007d3418ee58e0e3bd49d12dbcd031587f1bf5a2655a70fafae'
        }
      ]
    };

    return getByAddress(addresses)(dispatchMock, getStateMock).then((transactions) => {
      expect(transactions).toMatchObject(expectedResult);
    });
  });
});
