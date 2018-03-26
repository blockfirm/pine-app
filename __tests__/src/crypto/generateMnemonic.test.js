import generateMnemonic from '../../../src/crypto/generateMnemonic';

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
      // The seed to these words are mocked in __mocks__/react-native-randombytes.js.
      const expectedWords = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
      expect(words).toBe(expectedWords);
    });
  });
});
