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
});
