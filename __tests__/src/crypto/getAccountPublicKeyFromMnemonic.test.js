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
    const expectedXpub = 'xpub6DSRbSVW1dLqzqg5Ty9qwoh3ycjU3fS8uHtuh8dXoXhx7umBt3rimmXV5ZgPVECdrjgnXVjTKVUxxaccr18DpxFd7daHBZtAGBHoayyHRRt';

    expect(actualXpub).toBe(expectedXpub);
  });
});
