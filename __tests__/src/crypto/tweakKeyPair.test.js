import * as bitcoin from 'bitcoinjs-lib';
import tweakKeyPair from '../../../src/crypto/tweakKeyPair';

describe('tweakKeyPair', () => {
  describe('when no tweak is set', () => {
    it('returns the passed key pair', () => {
      const keyPair = bitcoin.ECPair.fromWIF(
        'L2uPYXe17xSTqbCjZvL2DsyXPCbXspvcu5mHLDYUgzdUbZGSKrSr'
      );

      const signDescriptor = {};
      const tweakedKeyPair = tweakKeyPair(keyPair, signDescriptor);

      expect(tweakedKeyPair.privateKey.equals(keyPair.privateKey)).toBe(true);
      expect(tweakedKeyPair.publicKey.equals(keyPair.publicKey)).toBe(true);
    });
  });

  describe('when singleTweak is set', () => {
    it('returns a single-tweaked key pair', () => {
      const keyPair = bitcoin.ECPair.fromWIF(
        'L2uPYXe17xSTqbCjZvL2DsyXPCbXspvcu5mHLDYUgzdUbZGSKrSr'
      );

      const signDescriptor = {
        singleTweak: Buffer.from([68, 195, 50, 57, 129, 182, 24, 34, 17, 62, 82, 84, 56, 89, 99, 18, 126, 189, 161, 62, 188, 13, 187, 5, 222, 203, 34, 11, 48, 114, 27, 109])
      };

      const tweakedKeyPair = tweakKeyPair(keyPair, signDescriptor);

      expect(tweakedKeyPair.privateKey.equals(
        Buffer.from('ee5c95383fec57cab11d4afefae37c2bc52de79404f4edd9d73201479036adb5', 'hex')
      )).toBe(true);

      expect(tweakedKeyPair.publicKey.equals(
        Buffer.from('037fa48c4f6fd37993344269d0bce14a8f52e615528c1d617318efcf5582a44e24', 'hex')
      )).toBe(true);
    });
  });
});
