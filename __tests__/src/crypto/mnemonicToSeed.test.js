import mnemonicToSeed from '../../../src/crypto/mnemonicToSeed';

describe('mnemonicToSeed', () => {
  it('is a function', () => {
    expect(typeof mnemonicToSeed).toBe('function');
  });

  it('accepts one argument', () => {
    expect(mnemonicToSeed.length).toBe(1);
  });

  it('returns a BIP39 seed', () => {
    const mnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const seed = mnemonicToSeed(mnemonic);

    expect(seed.toString('hex')).toBe(
      'a3a99acc7fe076cdc923d0ae79ee735671d8d70a79de19593cca8638f31942511e10b2e3551fc1c684da73c5cfebf1e9f289dbf3fb29f2589ccef2fabd91ed2c'
    );
  });
});
