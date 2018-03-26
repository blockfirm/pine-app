
import generateMnemonic from '../../../src/crypto/generateMnemonic';

jest.mock('../../../src/crypto/getRandomBytes', () => {
  return (size) => {
    const hexString = '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF';
    const sizedHexString = hexString.substr(0, size * 2);
    const randomBytes = new Buffer(sizedHexString, 'hex');

    return Promise.resolve(randomBytes);
  };
});

describe('generateMnemonic', () => {
  it('is a function', () => {
    expect(typeof generateMnemonic).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(generateMnemonic.length).toBe(0);
  });

  it('returns a promise', () => {
    const returnValue = generateMnemonic();
    expect(returnValue).toBeInstanceOf(Promise);
  });

  it('returns 12 random words', () => {
    expect.hasAssertions();

    return generateMnemonic().then((words) => {
      const expectedWords = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      expect(words).toBe(expectedWords);
    });
  });
});
