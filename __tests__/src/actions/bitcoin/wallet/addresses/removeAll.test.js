import {
  removeAll as removeAllAddresses,
  BITCOIN_WALLET_ADDRESSES_REMOVE_ALL_SUCCESS
} from '../../../../../../src/actions/bitcoin/wallet/addresses/removeAll';

import { save as saveAddresses } from '../../../../../../src/actions/bitcoin/wallet/addresses/save';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../../../src/actions/bitcoin/wallet/addresses/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_WALLET_ADDRESSES_REMOVE_ALL_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_REMOVE_ALL_SUCCESS"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_REMOVE_ALL_SUCCESS).toBe('BITCOIN_WALLET_ADDRESSES_REMOVE_ALL_SUCCESS');
  });
});

describe('removeAll', () => {
  it('is a function', () => {
    expect(typeof removeAllAddresses).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(removeAllAddresses.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = removeAllAddresses();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_REMOVE_ALL_SUCCESS', () => {
    removeAllAddresses()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_ADDRESSES_REMOVE_ALL_SUCCESS
    });
  });

  it('saves the state', () => {
    removeAllAddresses()(dispatchMock);
    expect(saveAddresses).toHaveBeenCalled();
  });
});
