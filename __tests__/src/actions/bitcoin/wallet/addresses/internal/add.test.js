import {
  add as addAddresses,
  BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS
} from '../../../../../../../src/actions/bitcoin/wallet/addresses/internal/add';

import { save as saveAddresses } from '../../../../../../../src/actions/bitcoin/wallet/addresses/internal/save';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../../../../src/actions/bitcoin/wallet/addresses/internal/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS).toBe('BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS');
  });
});

describe('add', () => {
  let fakeAddresses;

  beforeEach(() => {
    fakeAddresses = {
      'de64b2b8-2a2e-4d39-8795-76d286c92d3b': null,
      '4f49651e-3db6-4b57-9daa-62f74b0e3dac': null,
      'aff876e2-5030-4c9a-8b7f-9bddb656bfc1': null
    };
  });

  it('is a function', () => {
    expect(typeof addAddresses).toBe('function');
  });

  it('accepts one argument', () => {
    expect(addAddresses.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = addAddresses(fakeAddresses);
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS with the addresses', () => {
    addAddresses(fakeAddresses)(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS,
      addresses: fakeAddresses
    });
  });

  it('resolves to the passed addresses', () => {
    expect.hasAssertions();

    return addAddresses(fakeAddresses)(dispatchMock).then((addresses) => {
      expect(addresses).toBe(fakeAddresses);
    });
  });

  it('saves the state', () => {
    addAddresses(fakeAddresses)(dispatchMock);
    expect(saveAddresses).toHaveBeenCalled();
  });
});
