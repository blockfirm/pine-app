import getAccountPublicKeyFromMnemonic from '../../../src/crypto/getAccountPublicKeyFromMnemonic';

describe('getAccountPublicKeyFromMnemonic', () => {
  it('is a function', () => {
    expect(typeof getAccountPublicKeyFromMnemonic).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(getAccountPublicKeyFromMnemonic.length).toBe(3);
  });

  it('returns the extended public key from specified mnemonic, network, and account', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const network = 'mainnet';
    const accountIndex = 0;
    const actualXpub = getAccountPublicKeyFromMnemonic(mnemonic, network, accountIndex);
    const expectedXpub = 'xpub6CH1fB4u46pEeFwxKUqpcZ6QygCpCCZQupVnGrSApVfft9rBBYxzkVB48j1ZkSYBckz2VQPXzseDm2ZyVgL7PRmcT6FPwZtJQjLGDLa9A2D';

    expect(actualXpub).toBe(expectedXpub);
  });
});
