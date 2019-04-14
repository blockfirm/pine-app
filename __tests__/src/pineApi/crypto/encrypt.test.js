import { encrypt, decrypt } from '../../../../src/pineApi/crypto';

describe('encrypt', () => {
  it('is a function', () => {
    expect(typeof encrypt).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(encrypt.length).toBe(2);
  });

  it('resolves to an ECIES object', () => {
    const message = '973d172e-50a0-44f7-9c53-6a48fe2e0041';
    const publicKey = Buffer.from([3, 2, 250, 18, 174, 192, 182, 176, 198, 84, 227, 62, 133, 137, 16, 205, 138, 158, 252, 82, 32, 235, 111, 99, 163, 181, 237, 218, 184, 40, 160, 229, 56]);

    expect.hasAssertions();

    return encrypt(message, publicKey).then((ecies) => {
      expect(ecies).toHaveProperty('iv');
      expect(ecies).toHaveProperty('ephemPublicKey');
      expect(ecies).toHaveProperty('ciphertext');
      expect(ecies).toHaveProperty('mac');
    });
  });

  describe('the resolved ECIES object', () => {
    let message;
    let privateKey;
    let publicKey;
    let ecies;

    beforeAll(() => {
      message = '973d172e-50a0-44f7-9c53-6a48fe2e0041';
      privateKey = Buffer.from([27, 128, 202, 12, 137, 6, 174, 97, 122, 161, 74, 126, 80, 47, 255, 62, 241, 65, 171, 157, 59, 77, 173, 81, 223, 195, 253, 62, 248, 92, 221, 182]);
      publicKey = Buffer.from([3, 2, 250, 18, 174, 192, 182, 176, 198, 84, 227, 62, 133, 137, 16, 205, 138, 158, 252, 82, 32, 235, 111, 99, 163, 181, 237, 218, 184, 40, 160, 229, 56]);

      return encrypt(message, publicKey).then((result) => {
        ecies = result;
      });
    });

    it('.iv is a buffer of 16 bytes', () => {
      expect(Buffer.isBuffer(ecies.iv)).toBe(true);
      expect(ecies.iv).toHaveLength(16);
    });

    it('.ephemPublicKey is a buffer of 65 bytes', () => {
      expect(Buffer.isBuffer(ecies.ephemPublicKey)).toBe(true);
      expect(ecies.ephemPublicKey).toHaveLength(65);
    });

    it('.ciphertext is a non-empty buffer', () => {
      expect(Buffer.isBuffer(ecies.ciphertext)).toBe(true);
      expect(ecies.ciphertext.length).toBeGreaterThan(0);
    });

    it('.mac is a buffer of 32 bytes', () => {
      expect(Buffer.isBuffer(ecies.mac)).toBe(true);
      expect(ecies.mac).toHaveLength(32);
    });

    it('can be decrypted again', () => {
      expect.hasAssertions();

      return decrypt(ecies, privateKey).then((decrypted) => {
        expect(decrypted).toBe(message);
      });
    });
  });
});
