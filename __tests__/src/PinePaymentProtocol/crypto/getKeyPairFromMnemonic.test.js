import getKeyPairFromMnemonic from '../../../../src/PinePaymentProtocol/crypto/getKeyPairFromMnemonic';

describe('getKeyPairFromMnemonic', () => {
  it('is a function', () => {
    expect(typeof getKeyPairFromMnemonic).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getKeyPairFromMnemonic.length).toBe(1);
  });

  it('returns a bitcoinjs key pair from the passed mnemonic', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const keyPair = getKeyPairFromMnemonic(mnemonic);

    const expectedPrivateKey = Buffer.from([27, 128, 202, 12, 137, 6, 174, 97, 122, 161, 74, 126, 80, 47, 255, 62, 241, 65, 171, 157, 59, 77, 173, 81, 223, 195, 253, 62, 248, 92, 221, 182]);
    const expectedPublicKey = Buffer.from([3, 2, 250, 18, 174, 192, 182, 176, 198, 84, 227, 62, 133, 137, 16, 205, 138, 158, 252, 82, 32, 235, 111, 99, 163, 181, 237, 218, 184, 40, 160, 229, 56]);

    expect(keyPair.privateKey).toBeInstanceOf(Buffer);
    expect(keyPair.privateKey.equals(expectedPrivateKey)).toBe(true);

    expect(keyPair.publicKey).toBeInstanceOf(Buffer);
    expect(keyPair.publicKey.equals(expectedPublicKey)).toBe(true);
  });

  it('returns a compressed key pair', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const keyPair = getKeyPairFromMnemonic(mnemonic);

    expect(keyPair.compressed).toBe(true);
  });
});
