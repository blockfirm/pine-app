import {
  removeAll as removeAllUtxos,
  BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS
} from '../../../../../../src/actions/bitcoin/wallet/utxos/removeAll';

import { save as saveUtxos } from '../../../../../../src/actions/bitcoin/wallet/utxos/save';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../../../src/actions/bitcoin/wallet/utxos/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS"', () => {
    expect(BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS).toBe('BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS');
  });
});

describe('removeAll', () => {
  it('is a function', () => {
    expect(typeof removeAllUtxos).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(removeAllUtxos.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = removeAllUtxos();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS', () => {
    removeAllUtxos()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS
    });
  });

  it('saves the state', () => {
    removeAllUtxos()(dispatchMock);
    expect(saveUtxos).toHaveBeenCalled();
  });
});
