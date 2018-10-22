import getKeyMetadata from '../../../src/crypto/getKeyMetadata';

describe('getKeyMetadata', () => {
  it('is a function', () => {
    expect(typeof getKeyMetadata).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(getKeyMetadata.length).toBe(3);
  });

  it('returns an object with the root public key as publicKey', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const network = 'mainnet';
    const accountIndex = 0;
    const metadata = getKeyMetadata(mnemonic, network, accountIndex);
    const expectedPublicKey = 'xpub661MyMwAqRbcEZPARrmxHSSqxCYzLDVZRjMFaZyCLVdjq5f2rhiesjsjwMxqA4n9N3Jye2kQcBzqB2MzBR5sE4CqbDt7W3EQyJS61NQK81H';

    expect(metadata).toBeTruthy();
    expect(metadata.publicKey).toBe(expectedPublicKey);
  });

  it('returns an object with the public key for account 0 as accountPublicKey', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const network = 'mainnet';
    const accountIndex = 0;
    const metadata = getKeyMetadata(mnemonic, network, accountIndex);
    const expectedAccountPublicKey = 'xpub6CH1fB4u46pEeFwxKUqpcZ6QygCpCCZQupVnGrSApVfft9rBBYxzkVB48j1ZkSYBckz2VQPXzseDm2ZyVgL7PRmcT6FPwZtJQjLGDLa9A2D';

    expect(metadata.accountPublicKey).toBe(expectedAccountPublicKey);
  });
});
