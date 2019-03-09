import getKeyPairFromMnemonic from '../../../../src/pineApi/crypto/getKeyPairFromMnemonic';
import getUserIdFromPublicKey from '../../../../src/pineApi/crypto/getUserIdFromPublicKey';
import sign from '../../../../src/pineApi/crypto/sign';
import verify from '../../../../src/pineApi/crypto/verify';

describe('verify', () => {
  it('is a function', () => {
    expect(typeof verify).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(verify.length).toBe(3);
  });

  describe('when the signature was made for the correct message by the correct user', () => {
    it('returns true', () => {
      const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const keyPair = getKeyPairFromMnemonic(mnemonic);
      const userId = getUserIdFromPublicKey(keyPair.publicKey);
      const message = 'ab81613f-68ee-428c-b667-fcdad51cd89f';
      const signature = sign(message, keyPair);
      const verified = verify(message, signature, userId);

      expect(verified).toBe(true);
    });
  });

  describe('when the signature was made for the correct message but by another user', () => {
    it('returns false', () => {
      const mnemonic1 = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const mnemonic2 = 'test test fly battle rubber wasp afraid hamster guide essence test test';

      const keyPair1 = getKeyPairFromMnemonic(mnemonic1);
      const keyPair2 = getKeyPairFromMnemonic(mnemonic2);

      const userId2 = getUserIdFromPublicKey(keyPair2.publicKey);

      const message = 'ab81613f-68ee-428c-b667-fcdad51cd89f';
      const signature = sign(message, keyPair1);

      const verified = verify(message, signature, userId2);

      expect(verified).toBe(false);
    });
  });

  describe('when the signature was made for the wrong message by another user', () => {
    it('returns false', () => {
      const mnemonic1 = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const mnemonic2 = 'test test fly battle rubber wasp afraid hamster guide essence test test';

      const keyPair1 = getKeyPairFromMnemonic(mnemonic1);
      const keyPair2 = getKeyPairFromMnemonic(mnemonic2);

      const userId2 = getUserIdFromPublicKey(keyPair2.publicKey);

      const message1 = 'ab81613f-68ee-428c-b667-fcdad51cd89f';
      const message2 = 'ab81613f-68ee-428c-b667-fcdad51cd89f';

      const signature = sign(message1, keyPair1);

      const verified = verify(message2, signature, userId2);

      expect(verified).toBe(false);
    });
  });

  describe('when the signature was made for the wrong message by the correct user', () => {
    it('returns false', () => {
      const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      const keyPair = getKeyPairFromMnemonic(mnemonic);
      const userId = getUserIdFromPublicKey(keyPair.publicKey);
      const message1 = 'ab81613f-68ee-428c-b667-fcdad51cd89f';
      const message2 = '84bdd490-197f-42ae-b2ff-8a15e510b1ca';
      const signature = sign(message1, keyPair);
      const verified = verify(message2, signature, userId);

      expect(verified).toBe(false);
    });
  });
});
