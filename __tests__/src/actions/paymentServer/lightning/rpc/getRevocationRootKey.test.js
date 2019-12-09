import {
  getRevocationRootKey,
  PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY
} from '../../../../../../src/actions/paymentServer/lightning/rpc/getRevocationRootKey';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => require('../../../../actions/bitcoin/wallet/transactions/__fixtures__/state'));
  }

  return action;
});

const getStateMock = jest.fn(() => require('../../../../actions/bitcoin/wallet/transactions/__fixtures__/state'));

jest.mock('../../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('chicken approve topic suit shiver party whale holiday pitch source angry naive'));
});

describe('PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY', () => {
  it('equals "PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY"', () => {
    expect(PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY).toBe('PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY');
  });
});

describe('getRevocationRootKey', () => {
  it('is a function', () => {
    expect(typeof getRevocationRootKey).toBe('function');
  });

  it('returns a new revocation root key', () => {
    const expectedPrivateKey = '693c08b89849d739f7dd66992234e7d8bee11dfb6a63057fe65c57891900fb3b';

    expect.hasAssertions();

    return getRevocationRootKey()(dispatchMock, getStateMock).then(response => {
      expect(response.privateKey.toString('hex')).toBe(expectedPrivateKey);
    });
  });
});
