import * as Keychain from 'react-native-keychain';
import removeMnemonicByKey from '../../../src/crypto/removeMnemonicByKey';

describe('removeMnemonicByKey', () => {
  beforeEach(() => {
    Keychain.resetGenericPassword.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeMnemonicByKey).toBe('function');
  });

  it('accepts one argument', () => {
    expect(removeMnemonicByKey.length).toBe(1);
  });

  it('calls Keychain.resetGenericPassword with service set to the key id', () => {
    const fakeKeyId = 'c9103642-6a6e-46ca-ad74-30acb61c238a';
    removeMnemonicByKey(fakeKeyId);
    expect(Keychain.resetGenericPassword).toBeCalledWith(fakeKeyId);
  });

  it('returns the result from Keychain.resetGenericPassword', () => {
    Keychain.resetGenericPassword.mockImplementationOnce(() => {
      return 'd8de749d-0773-4f36-955c-25cdb9c2712b';
    });

    const returnValue = removeMnemonicByKey();

    expect(returnValue).toBe('d8de749d-0773-4f36-955c-25cdb9c2712b');
  });
});
