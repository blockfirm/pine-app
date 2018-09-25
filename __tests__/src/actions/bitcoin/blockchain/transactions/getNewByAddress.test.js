import {
  getNewByAddress,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS,
  BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE
} from '../../../../../../src/actions/bitcoin/blockchain/transactions/getNewByAddress';

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

jest.mock('../../../../../../src/actions/bitcoin/blockchain/transactions/get', () => ({
  get: (addresses, page) => {
    if (page === 1) {
      // Mocking page 1.
      return () => Promise.resolve({
        '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx': [
          {
            txid: '5c12140f-5b38-4849-a8fc-82233302d787'
          },
          {
            txid: '6c1ec2a5-2553-4b31-b9ae-1a370ede983f'
          },
          {
            txid: '633f7bdc-8498-4b87-a12b-b7ca980d0c0a'
          },
          {
            txid: '8cc0b92c-53ac-499f-9669-ef47635cbb8b'
          },
          {
            txid: 'cd231c4c-5f2f-4bee-b896-a49537bd967c'
          }
        ],
        'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx': [
          {
            txid: 'd41748c7-0f45-4038-b9a3-c893e9c44329'
          },
          {
            txid: 'caf3b119-26a2-42e3-bec6-efedb2ae38fb'
          },
          {
            txid: 'de118c63-3dd7-46b7-abc6-d21bc8e6da5b'
          },
          {
            txid: 'a31e41a0-a9db-466e-a888-1fd3bcce839f'
          },
          {
            txid: 'ca417edf-3cc6-4f77-9df9-b7e825267d81'
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
            txid: 'e4945079-1815-4ce4-bd59-e13d171ff7ee'
          },
          {
            txid: '71bb0a2b-3e74-444f-bcd9-cc783f625c20'
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

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST');
  });
});

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS');
  });
});

describe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE', () => {
  it('equals "BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE"', () => {
    expect(BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE).toBe('BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE');
  });
});

describe('getNewByAddress', () => {
  it('returns all new transactions for the specified addresses', () => {
    const addresses = [
      '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx',
      'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx'
    ];

    const oldTransactions = [
      {
        txid: '633f7bdc-8498-4b87-a12b-b7ca980d0c0a'
      },
      {
        txid: '8cc0b92c-53ac-499f-9669-ef47635cbb8b'
      },
      {
        txid: 'cd231c4c-5f2f-4bee-b896-a49537bd967c'
      },
      {
        txid: '71bb0a2b-3e74-444f-bcd9-cc783f625c20'
      }
    ];

    const expectedResult = {
      '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx': [
        {
          txid: '5c12140f-5b38-4849-a8fc-82233302d787'
        },
        {
          txid: '6c1ec2a5-2553-4b31-b9ae-1a370ede983f'
        }
      ],
      'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx': [
        {
          txid: 'd41748c7-0f45-4038-b9a3-c893e9c44329'
        },
        {
          txid: 'caf3b119-26a2-42e3-bec6-efedb2ae38fb'
        },
        {
          txid: 'de118c63-3dd7-46b7-abc6-d21bc8e6da5b'
        },
        {
          txid: 'a31e41a0-a9db-466e-a888-1fd3bcce839f'
        },
        {
          txid: 'ca417edf-3cc6-4f77-9df9-b7e825267d81'
        },
        {
          txid: 'e4945079-1815-4ce4-bd59-e13d171ff7ee'
        }
      ]
    };

    return getNewByAddress(addresses, oldTransactions)(dispatchMock, getStateMock).then((transactions) => {
      expect(transactions).toMatchObject(expectedResult);
    });
  });
});
