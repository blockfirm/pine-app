import validateAddress from '../../../../src/crypto/bitcoin/validateAddress';

describe('validateAddress', () => {
  it('is a function', () => {
    expect(typeof validateAddress).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(validateAddress.length).toBe(2);
  });

  it('returns true for a p2wpkh (segwit) address on testnet', () => {
    const isValid = validateAddress('2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm', 'testnet');
    expect(isValid).toBe(true);
  });

  it('returns true for a p2pkh address on testnet', () => {
    const isValid = validateAddress('mrCRSZCNEJK8i9R3arrrK6sSUg1uRZnbEs', 'testnet');
    expect(isValid).toBe(true);
  });

  it('returns true for a p2sh address on mainnet', () => {
    const isValid = validateAddress('3AepBsvUBY2mgLHZ6Qz8FqNKEzfeRxdavR', 'mainnet');
    expect(isValid).toBe(true);
  });

  it('returns true for a p2pkh address on mainnet', () => {
    const isValid = validateAddress('15KDN6U7TkGub1pYEMKewMgXGQzoQSdHyQ', 'mainnet');
    expect(isValid).toBe(true);
  });

  it('returns false for a testnet p2wpkh address on mainnet', () => {
    const isValid = validateAddress('2MvQNs9R4qwbfiBaEtbCq8EgUfUxhccHyqm', 'mainnet');
    expect(isValid).toBe(false);
  });

  it('returns false for a mainnet p2pkh address on testnet', () => {
    const isValid = validateAddress('15KDN6U7TkGub1pYEMKewMgXGQzoQSdHyQ', 'testnet');
    expect(isValid).toBe(false);
  });

  it('returns false for a uuid', () => {
    const isValid = validateAddress('bc999453-14d0-4bfe-ada0-0f123ce29104', 'mainnet');
    expect(isValid).toBe(false);
  });
});
