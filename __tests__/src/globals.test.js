import { Buffer } from 'buffer';
import process from 'process';
import reactNativeCrypto from 'react-native-crypto';
import '../../src/globals';

describe('globals', () => {
  it('it exposes buffer.Buffer as Buffer', () => {
    expect(global.Buffer).toBe(Buffer);
  });

  it('it exposes process', () => {
    expect(global.process).toBe(process);
  });

  it('it sets process.browser to false', () => {
    expect(global.process.browser).toBe(false);
  });

  it('it exposes react-native-crypto as crypto', () => {
    expect(global.crypto).toBe(reactNativeCrypto);
  });

  it('it exposes crypto.getRandomValues', () => {
    expect(typeof global.crypto.getRandomValues).toBe('function');
  });

  describe('global.crypto.getRandomValues(array)', () => {
    it('overwrites the specified array with random values', () => {
      const array = new Buffer('999999', 'hex');

      global.crypto.getRandomValues(array);

      // This is mocked in __mocks__/react-native-randombytes.js.
      expect(array.toString('hex')).toBe('012345');
    });

    it('returns the specified array', () => {
      const array = new Buffer('999999', 'hex');
      const returnValue = global.crypto.getRandomValues(array);

      expect(returnValue).toBe(array);
    });
  });
});
