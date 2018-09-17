import {
  update as updateUtxos,
  BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS
} from '../../../../../../src/actions/bitcoin/wallet/utxos/update';

import { save as saveUtxos } from '../../../../../../src/actions/bitcoin/wallet/utxos/save';

const expectedUtxos = require('../__fixtures__/utxos');

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  bitcoin: {
    wallet: {
      addresses: {
        external: {
          items: require('../__fixtures__/externalAddresses')
        },
        internal: {
          items: require('../__fixtures__/internalAddresses')
        }
      },
      transactions: {
        items: require('../__fixtures__/transactions')
      }
    }
  }
}));

jest.mock('../../../../../../src/actions/bitcoin/wallet/utxos/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS"', () => {
    expect(BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS).toBe('BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS');
  });
});

describe('update', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof updateUtxos).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(updateUtxos.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = updateUtxos();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS with returned utxos', () => {
    expect.hasAssertions();

    return updateUtxos()(dispatchMock, getStateMock).then((utxos) => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS,
        utxos
      });
    });
  });

  it('resolves to a list of unspent transaction outputs for this wallet', () => {
    expect.hasAssertions();

    return updateUtxos()(dispatchMock, getStateMock).then((utxos) => {
      expect(utxos).toEqual(expect.arrayContaining(expectedUtxos));
    });
  });

  it('saves the state', () => {
    expect.hasAssertions();

    return updateUtxos()(dispatchMock, getStateMock).then(() => {
      expect(saveUtxos).toHaveBeenCalled();
    });
  });
});
