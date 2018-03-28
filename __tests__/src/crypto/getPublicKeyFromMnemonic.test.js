import getPublicKeyFromMnemonic from '../../../src/crypto/getPublicKeyFromMnemonic';

describe('getPublicKeyFromMnemonic', () => {
  it('is a function', () => {
    expect(typeof getPublicKeyFromMnemonic).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getPublicKeyFromMnemonic.length).toBe(1);
  });

  it('returns the extended public key from specified mnemonic', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const actualXpub = getPublicKeyFromMnemonic(mnemonic);
    const expectedXpub = 'xpub661MyMwAqRbcEZPARrmxHSSqxCYzLDVZRjMFaZyCLVdjq5f2rhiesjsjwMxqA4n9N3Jye2kQcBzqB2MzBR5sE4CqbDt7W3EQyJS61NQK81H';

    expect(actualXpub).toBe(expectedXpub);
  });
});
