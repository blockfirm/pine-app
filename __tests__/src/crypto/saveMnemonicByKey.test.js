import * as Keychain from 'react-native-keychain';
import saveMnemonicByKey from '../../../src/crypto/saveMnemonicByKey';

describe('saveMnemonicByKey', () => {
  beforeEach(() => {
    Keychain.setGenericPassword.mockClear();
  });

  it('is a function', () => {
    expect(typeof saveMnemonicByKey).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(saveMnemonicByKey.length).toBe(2);
  });

  it('calls Keychain.setGenericPassword with password set to the mnemonic', () => {
    const fakeMnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const fakeKeyId = '8f8b6bb3-03a7-4d72-b948-2797ec7e3b98';

    saveMnemonicByKey(fakeMnemonic, fakeKeyId);

    expect(Keychain.setGenericPassword.mock.calls[0][1]).toBe(fakeMnemonic);
  });

  it('calls Keychain.setGenericPassword with service set to the key id', () => {
    const fakeMnemonic = 'abuse boss fly battle rubber wasp afraid hamster guide essence vibrant tattoo';
    const fakeKeyId = 'ce783fa2-5a37-4074-b625-877c68d2125c';

    saveMnemonicByKey(fakeMnemonic, fakeKeyId);

    expect(Keychain.setGenericPassword.mock.calls[0][2]).toBe(fakeKeyId);
  });

  it('returns the result from Keychain.setGenericPassword', () => {
    Keychain.setGenericPassword.mockImplementationOnce(() => {
      return '1b9b714d-f3f0-48f3-8a58-9f5d058cbd3a';
    });

    const returnValue = saveMnemonicByKey('', null);

    expect(returnValue).toBe('1b9b714d-f3f0-48f3-8a58-9f5d058cbd3a');
  });
});
