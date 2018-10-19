import {
  getUnusedAddress,
  BITCOIN_WALLET_GET_UNUSED_ADDRESS_REQUEST,
  BITCOIN_WALLET_GET_UNUSED_ADDRESS_SUCCESS,
  BITCOIN_WALLET_GET_UNUSED_ADDRESS_FAILURE
} from '../../../../../src/actions/bitcoin/wallet/getUnusedAddress';

import { add as addExternalAddress } from '../../../../../src/actions/bitcoin/wallet/addresses/external/add';
import { add as addInternalAddress } from '../../../../../src/actions/bitcoin/wallet/addresses/internal/add';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    bitcoin: {
      network: 'testnet'
    }
  },
  keys: {
    items: {
      '411774c9-f047-41cc-a42c-aefee14177ae': {}
    }
  },
  bitcoin: {
    wallet: {
      transactions: {
        items: [
          {
            vout: [
              {
                scriptPubKey: {
                  addresses: [
                    'mjcyVnV7QobWh2HY7zsQrmizoyp5g2XsJb',
                    'mxp61ayhfiEaCmLYiaaaKn5pZwFNPBMRbt'
                  ]
                }
              }
            ]
          },
          {
            vout: [
              {
                scriptPubKey: {
                  addresses: [
                    'munqYEEL88K3bGw7K5fn4rAGqHqqGM1ZXr'
                  ]
                }
              }
            ]
          }
        ]
      },
      addresses: {
        external: {
          items: {
            'mjcyVnV7QobWh2HY7zsQrmizoyp5g2XsJb': {},
            'mxp61ayhfiEaCmLYiaaaKn5pZwFNPBMRbt': {}
          }
        },
        internal: {
          items: {
            'munqYEEL88K3bGw7K5fn4rAGqHqqGM1ZXr': {},
            'muVNCbM3yqWnU4CxeBzqQyNXFAh1FHAxDU': {}
          }
        }
      }
    }
  }
}));

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    return Promise.resolve(mnemonic);
  });
});

jest.mock('../../../../../src/actions/bitcoin/wallet/addresses/external/add', () => ({
  add: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/bitcoin/wallet/addresses/internal/add', () => ({
  add: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_WALLET_GET_UNUSED_ADDRESS_REQUEST', () => {
  it('equals "BITCOIN_WALLET_GET_UNUSED_ADDRESS_REQUEST"', () => {
    expect(BITCOIN_WALLET_GET_UNUSED_ADDRESS_REQUEST).toBe('BITCOIN_WALLET_GET_UNUSED_ADDRESS_REQUEST');
  });
});

describe('BITCOIN_WALLET_GET_UNUSED_ADDRESS_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_GET_UNUSED_ADDRESS_SUCCESS"', () => {
    expect(BITCOIN_WALLET_GET_UNUSED_ADDRESS_SUCCESS).toBe('BITCOIN_WALLET_GET_UNUSED_ADDRESS_SUCCESS');
  });
});

describe('BITCOIN_WALLET_GET_UNUSED_ADDRESS_FAILURE', () => {
  it('equals "BITCOIN_WALLET_GET_UNUSED_ADDRESS_FAILURE"', () => {
    expect(BITCOIN_WALLET_GET_UNUSED_ADDRESS_FAILURE).toBe('BITCOIN_WALLET_GET_UNUSED_ADDRESS_FAILURE');
  });
});

describe('getUnusedAddress', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
    addExternalAddress.mockClear();
    addInternalAddress.mockClear();
  });

  it('creates a new address if the last has already been used', () => {
    expect.hasAssertions();

    return getUnusedAddress()(dispatchMock, getStateMock).then((address) => {
      expect(address).toBe('n1YhqSM6meuTyMhExoC77YftxCavekHbuu');
    });
  });

  it('saves the new address', () => {
    expect.hasAssertions();

    return getUnusedAddress()(dispatchMock, getStateMock).then((address) => {
      const addressMap = { [address]: { used: false } };
      expect(addExternalAddress).toHaveBeenCalledWith(addressMap);
    });
  });

  it('returns the last address if it has not been used yet', () => {
    const internal = true;

    expect.hasAssertions();

    return getUnusedAddress(internal)(dispatchMock, getStateMock).then((address) => {
      expect(address).toBe('muVNCbM3yqWnU4CxeBzqQyNXFAh1FHAxDU');
    });
  });
});
