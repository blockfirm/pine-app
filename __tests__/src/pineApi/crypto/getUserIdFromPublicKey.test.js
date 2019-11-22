import getAccountKeyPairFromMnemonic from '../../../../src/pineApi/crypto/getAccountKeyPairFromMnemonic';
import getUserIdFromPublicKey from '../../../../src/pineApi/crypto/getUserIdFromPublicKey';

describe('getUserIdFromPublicKey', () => {
  it('is a function', () => {
    expect(typeof getUserIdFromPublicKey).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getUserIdFromPublicKey.length).toBe(1);
  });

  it('returns a user id based on the passed public key', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const keyPair = getAccountKeyPairFromMnemonic(mnemonic);
    const publicKey = keyPair.publicKey;
    const userId = getUserIdFromPublicKey(publicKey);

    expect(userId).toEqual('3FkEeUwXcick1EMMVBjnyjGiZSzCM1Pve');
  });
});
