import { encrypt, decrypt } from '../../../../src/pineApi/crypto';

describe('encrypt', () => {
  it('is a function', () => {
    expect(typeof encrypt).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(encrypt.length).toBe(2);
  });

  it('resolves to an encrypted message', () => {
    const message = '973d172e-50a0-44f7-9c53-6a48fe2e0041';
    const publicKey = Buffer.from([3, 2, 250, 18, 174, 192, 182, 176, 198, 84, 227, 62, 133, 137, 16, 205, 138, 158, 252, 82, 32, 235, 111, 99, 163, 181, 237, 218, 184, 40, 160, 229, 56]);

    expect.hasAssertions();

    return encrypt(message, publicKey).then((encryptedMessage) => {
      expect(encryptedMessage).toBe('eyJpdiI6IjAxMjM0NTY3ODlhYmNkZWYwMTIzNDU2Nzg5YWJjZGVmIiwiZXBoZW1QdWJsaWNLZXkiOiIwNDQ2NDZhZTUwNDczMTZiNDIzMGQwMDg2YzhhY2VjNjg3ZjAwYjFjZDlkMWRjNjM0ZjZjYjM1OGFjMGE5YThmZmZmZTc3YjRkZDBhNGJmYjk1ODUxZjNiNzM1NWM3ODFkZDYwZjg0MThmYzhhNjVkMTQ5MDdhZmY0N2M5MDNhNTU5IiwiY2lwaGVydGV4dCI6IjlmOGJiNzM2YWYzZmIxMmZjNmNmNjEwZmNlNzkxNTYxZTkxMDRjZDQ4Zjc0YTM4YjNjNzRiZWMyMzZkODFkNmVhNjJlNWE0M2ExNDJkMDM4Y2NjZmVmNWNiODMxNTNiYiIsIm1hYyI6IjJkMjE1YThmYTNkZTNlMDBhMWM3M2ZlNGZlYTg1Njg5ZTJhMWQzZWYzM2QzYzc4N2NlMDQzZjc5NWE0MWU4YmYifQ==');
    });
  });

  describe('the encrypted message', () => {
    it('can be decrypted again', () => {
      const message = '973d172e-50a0-44f7-9c53-6a48fe2e0041';
      const publicKey = Buffer.from([3, 2, 250, 18, 174, 192, 182, 176, 198, 84, 227, 62, 133, 137, 16, 205, 138, 158, 252, 82, 32, 235, 111, 99, 163, 181, 237, 218, 184, 40, 160, 229, 56]);
      const privateKey = Buffer.from([27, 128, 202, 12, 137, 6, 174, 97, 122, 161, 74, 126, 80, 47, 255, 62, 241, 65, 171, 157, 59, 77, 173, 81, 223, 195, 253, 62, 248, 92, 221, 182]);

      expect.hasAssertions();

      return encrypt(message, publicKey).then((encryptedMessage) => {
        return decrypt(encryptedMessage, privateKey).then((decryptedMessage) => {
          expect(decryptedMessage).toBe(message);
        });
      });
    });
  });
});
