import getLightningKeyPairFromMnemonic from '../../../../../src/clients/paymentServer/crypto/getLightningKeyPairFromMnemonic';

describe('getLightningKeyPairFromMnemonic', () => {
  it('is a function', () => {
    expect(typeof getLightningKeyPairFromMnemonic).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getLightningKeyPairFromMnemonic.length).toBe(2);
  });

  describe('when the network is mainnet', () => {
    it('returns a bitcoinjs key pair from the passed mnemonic', () => {
      const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const keyPair = getLightningKeyPairFromMnemonic(mnemonic, 'mainnet');

      const expectedPrivateKey = Buffer.from('53330cfedbab552ac91b398f6b9e614d1ae96c8ad5980d52208270c215e3bd4f', 'hex');
      const expectedPublicKey = Buffer.from('02f9226b52874777a675879326e3280b50799ce9020e453e7cd8f1d4a92d9ceac9', 'hex');

      expect(keyPair.privateKey).toBeInstanceOf(Buffer);
      expect(keyPair.privateKey.equals(expectedPrivateKey)).toBe(true);

      expect(keyPair.publicKey).toBeInstanceOf(Buffer);
      expect(keyPair.publicKey.equals(expectedPublicKey)).toBe(true);
    });
  });

  describe('when the network is testnet', () => {
    it('returns a bitcoinjs key pair from the passed mnemonic', () => {
      const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const keyPair = getLightningKeyPairFromMnemonic(mnemonic, 'testnet');

      const expectedPrivateKey = Buffer.from('9c696b64053ad6909ea5ebdf6e24e9efda2dd7906558ea8b0780bc9a59dc6085', 'hex');
      const expectedPublicKey = Buffer.from('036158764639ac3457a2667cd0e1c53301d07ca0f8fd7a208860477a179b7a0edd', 'hex');

      expect(keyPair.privateKey).toBeInstanceOf(Buffer);
      expect(keyPair.privateKey.equals(expectedPrivateKey)).toBe(true);

      expect(keyPair.publicKey).toBeInstanceOf(Buffer);
      expect(keyPair.publicKey.equals(expectedPublicKey)).toBe(true);
    });
  });
});
