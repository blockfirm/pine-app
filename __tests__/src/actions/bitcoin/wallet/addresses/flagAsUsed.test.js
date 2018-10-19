import {
  flagAsUsed,
  BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED
} from '../../../../../../src/actions/bitcoin/wallet/addresses/flagAsUsed';

describe('BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED', () => {
  it('equals "BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED"', () => {
    expect(BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED).toBe('BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED');
  });
});

describe('flagAsUsed', () => {
  it('is a function', () => {
    expect(typeof flagAsUsed).toBe('function');
  });

  it('accepts one argument', () => {
    expect(flagAsUsed.length).toBe(1);
  });

  it('returns an object with type set to BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED', () => {
    const returnValue = flagAsUsed();

    expect(typeof returnValue).toBe('object');
    expect(returnValue.type).toBe(BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED);
  });

  it('returns an object with addresses set to the passed address list', () => {
    const fakeAddresses = [
      'c090b91a-f6a0-4e8a-87b2-1bf4839bd741',
      '6291ea86-0356-4022-80db-7a83a41eb091',
      '1ee6aee8-4ced-4ce2-be02-d8be16d7a842'
    ];

    const returnValue = flagAsUsed(fakeAddresses);

    expect(typeof returnValue).toBe('object');
    expect(returnValue.addresses).toBe(fakeAddresses);
  });
});
