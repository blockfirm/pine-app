import {
  sync,
  BITCOIN_WALLET_SYNC_REQUEST,
  BITCOIN_WALLET_SYNC_SUCCESS,
  BITCOIN_WALLET_SYNC_FAILURE
} from '../../../../../src/actions/bitcoin/wallet/sync';

import { getNewByAddress as getNewTransactionsByAddress } from '../../../../../src/actions/bitcoin/blockchain/transactions/getNewByAddress';
import { add as addTransactions } from '../../../../../src/actions/bitcoin/wallet/transactions/add';
import { updatePending as updatePendingTransactions } from '../../../../../src/actions/bitcoin/wallet/transactions/updatePending';
import { update as updateUtxos } from '../../../../../src/actions/bitcoin/wallet/utxos/update';
import { flagAsUsed } from '../../../../../src/actions/bitcoin/wallet/addresses/flagAsUsed';
import { getUnused as getUnusedAddress } from '../../../../../src/actions/bitcoin/wallet/addresses/getUnused';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({
      settings: {
        api: {
          baseUrl: 'http://localhost:8080/v1'
        }
      }
    }));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: 'cb88d929-aac1-4b9a-bc73-32bc3b1ca03d'
    }
  },
  bitcoin: {
    wallet: {
      transactions: {
        items: [
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
        ]
      },
      addresses: {
        external: {
          items: {
            '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx': {},
            'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx': {}
          }
        },
        internal: {
          items: {
            '6ccbe0f5-daba-4e7b-96be-003ad7eda843': {}
          }
        }
      }
    }
  },
  contacts: {
    items: {}
  },
  messages: {
    txids: {}
  }
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/transactions/add', () => ({
  add: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/transactions/updatePending', () => ({
  updatePending: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/utxos/update', () => ({
  update: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/addresses/external/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/addresses/internal/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/addresses/flagAsUsed', () => ({
  flagAsUsed: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/addresses/getUnused', () => ({
  getUnused: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/paymentServer/addresses/sync', () => ({
  sync: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/contacts/addLegacy', () => ({
  addLegacy: jest.fn(() => Promise.resolve({}))
}));

jest.mock('../../../../../src/actions/messages/add', () => ({
  add: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/crypto/bitcoin/getTransactionAmount', () => {
  return () => 0.001;
});

jest.mock('../../../../../src/crypto/bitcoin/getTransactionAddress', () => {
  return () => '05d6d9a1-039e-4e11-b494-ed43f54ca369';
});

jest.mock('../../../../../src/actions/bitcoin/blockchain/transactions/getNewByAddress', () => ({
  getNewByAddress: jest.fn((addresses) => {
    if (addresses.includes('2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx')) {
      // Mocking transactions for external addresses.
      return () => Promise.resolve({
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
      });
    }

    if (addresses.includes('6ccbe0f5-daba-4e7b-96be-003ad7eda843')) {
      // Mocking transactions for internal addresses.
      return () => Promise.resolve({
        '6ccbe0f5-daba-4e7b-96be-003ad7eda843': [
          {
            txid: '139d6715-9968-4481-9a0d-fcac93656e12'
          },
          {
            txid: '972a0e99-bea8-463c-9be1-3b37fe4f399b'
          }
        ]
      });
    }
  })
}));

describe('BITCOIN_WALLET_SYNC_REQUEST', () => {
  it('equals "BITCOIN_WALLET_SYNC_REQUEST"', () => {
    expect(BITCOIN_WALLET_SYNC_REQUEST).toBe('BITCOIN_WALLET_SYNC_REQUEST');
  });
});

describe('BITCOIN_WALLET_SYNC_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_SYNC_SUCCESS"', () => {
    expect(BITCOIN_WALLET_SYNC_SUCCESS).toBe('BITCOIN_WALLET_SYNC_SUCCESS');
  });
});

describe('BITCOIN_WALLET_SYNC_FAILURE', () => {
  it('equals "BITCOIN_WALLET_SYNC_FAILURE"', () => {
    expect(BITCOIN_WALLET_SYNC_FAILURE).toBe('BITCOIN_WALLET_SYNC_FAILURE');
  });
});

describe('sync', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
    getNewTransactionsByAddress.mockClear();
    addTransactions.mockClear();
    updateUtxos.mockClear();
  });

  it('adds all new external transactions to the wallet', () => {
    const expectedExternalTransactions = [
      {
        txid: '5c12140f-5b38-4849-a8fc-82233302d787'
      },
      {
        txid: '6c1ec2a5-2553-4b31-b9ae-1a370ede983f'
      },
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
    ];

    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      expect(addTransactions).toHaveBeenCalledWith(expectedExternalTransactions);
    });
  });

  it('adds all new internal transactions to the wallet', () => {
    const expectedInternalTransactions = [
      {
        txid: '139d6715-9968-4481-9a0d-fcac93656e12'
      },
      {
        txid: '972a0e99-bea8-463c-9be1-3b37fe4f399b'
      }
    ];

    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      expect(addTransactions).toHaveBeenCalledWith(expectedInternalTransactions);
    });
  });

  it('passes the old transactions from the state to the getNewByAddress method', () => {
    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      const expectedOldTransactions = [
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

      expect(getNewTransactionsByAddress).toHaveBeenCalledWith(expect.anything(), expectedOldTransactions);
    });
  });

  it('flags used addresses as used', () => {
    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      expect(flagAsUsed).toHaveBeenCalledWith([
        '2Mt4MnuchSfx7UqVSRU8jbtpJNRdQkRHudx',
        'moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx'
      ]);

      expect(flagAsUsed).toHaveBeenCalledWith([
        '6ccbe0f5-daba-4e7b-96be-003ad7eda843'
      ]);
    });
  });

  it('updates the unused addresses in state', () => {
    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      expect(getUnusedAddress).toHaveBeenCalledWith();
      expect(getUnusedAddress).toHaveBeenCalledWith(true);
    });
  });

  it('updates the utxo set', () => {
    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      expect(updateUtxos).toHaveBeenCalled();
    });
  });

  it('updates pending transactions', () => {
    expect.hasAssertions();

    return sync()(dispatchMock, getStateMock).then(() => {
      expect(updatePendingTransactions).toHaveBeenCalled();
    });
  });
});
