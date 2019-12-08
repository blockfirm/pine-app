import hash256 from '../../../../../src/clients/paymentServer/crypto/hash256';

describe('hash256', () => {
  it('is a function', () => {
    expect(typeof hash256).toBe('function');
  });

  it('accepts one argument', () => {
    expect(hash256.length).toBe(1);
  });

  it('returns a hash256 (double sha256) hash of the input', () => {
    const input = Buffer.from('1c801b9a-4ce0-4930-8dd6-d7270d0d7eed');
    const actualHash = hash256(input);
    const expectedHash = Buffer.from([187, 183, 107, 161, 50, 151, 201, 240, 39, 8, 189, 58, 254, 147, 91, 236, 4, 119, 7, 48, 164, 254, 229, 198, 249, 246, 11, 145, 231, 26, 183, 4]);

    expect(actualHash.equals(expectedHash)).toBe(true);
  });
});
