import { decrypt } from '../../../../../src/clients/paymentServer/crypto';

describe('decrypt', () => {
  it('is a function', () => {
    expect(typeof decrypt).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(decrypt.length).toBe(2);
  });

  it('decrypts an encrypted message with the correct private key', () => {
    const expectedMessage = '973d172e-50a0-44f7-9c53-6a48fe2e0041';
    const privateKey = Buffer.from([27, 128, 202, 12, 137, 6, 174, 97, 122, 161, 74, 126, 80, 47, 255, 62, 241, 65, 171, 157, 59, 77, 173, 81, 223, 195, 253, 62, 248, 92, 221, 182]);
    const encryptedMessage = 'eyJpdiI6IjAxMjM0NTY3ODlhYmNkZWYwMTIzNDU2Nzg5YWJjZGVmIiwiZXBoZW1QdWJsaWNLZXkiOiIwNDQ2NDZhZTUwNDczMTZiNDIzMGQwMDg2YzhhY2VjNjg3ZjAwYjFjZDlkMWRjNjM0ZjZjYjM1OGFjMGE5YThmZmZmZTc3YjRkZDBhNGJmYjk1ODUxZjNiNzM1NWM3ODFkZDYwZjg0MThmYzhhNjVkMTQ5MDdhZmY0N2M5MDNhNTU5IiwiY2lwaGVydGV4dCI6IjlmOGJiNzM2YWYzZmIxMmZjNmNmNjEwZmNlNzkxNTYxZTkxMDRjZDQ4Zjc0YTM4YjNjNzRiZWMyMzZkODFkNmVhNjJlNWE0M2ExNDJkMDM4Y2NjZmVmNWNiODMxNTNiYiIsIm1hYyI6IjJkMjE1YThmYTNkZTNlMDBhMWM3M2ZlNGZlYTg1Njg5ZTJhMWQzZWYzM2QzYzc4N2NlMDQzZjc5NWE0MWU4YmYifQ==';

    expect.hasAssertions();

    return decrypt(encryptedMessage, privateKey).then((message) => {
      expect(message).toBe(expectedMessage);
    });
  });

  it('cannot decrypt with an incorrect private key', () => {
    const privateKey = Buffer.from([27, 128, 202, 12, 130, 6, 174, 97, 122, 161, 74, 126, 80, 47, 255, 62, 241, 65, 171, 157, 59, 77, 173, 81, 223, 195, 253, 62, 248, 92, 221, 182]);
    const encryptedMessage = 'eyJpdiI6IjAxMjM0NTY3ODlhYmNkZWYwMTIzNDU2Nzg5YWJjZGVmIiwiZXBoZW1QdWJsaWNLZXkiOiIwNDQ2NDZhZTUwNDczMTZiNDIzMGQwMDg2YzhhY2VjNjg3ZjAwYjFjZDlkMWRjNjM0ZjZjYjM1OGFjMGE5YThmZmZmZTc3YjRkZDBhNGJmYjk1ODUxZjNiNzM1NWM3ODFkZDYwZjg0MThmYzhhNjVkMTQ5MDdhZmY0N2M5MDNhNTU5IiwiY2lwaGVydGV4dCI6IjlmOGJiNzM2YWYzZmIxMmZjNmNmNjEwZmNlNzkxNTYxZTkxMDRjZDQ4Zjc0YTM4YjNjNzRiZWMyMzZkODFkNmVhNjJlNWE0M2ExNDJkMDM4Y2NjZmVmNWNiODMxNTNiYiIsIm1hYyI6IjJkMjE1YThmYTNkZTNlMDBhMWM3M2ZlNGZlYTg1Njg5ZTJhMWQzZWYzM2QzYzc4N2NlMDQzZjc5NWE0MWU4YmYifQ==';

    expect.hasAssertions();

    return decrypt(encryptedMessage, privateKey).catch((error) => {
      expect(error).toBeTruthy();
    });
  });
});
