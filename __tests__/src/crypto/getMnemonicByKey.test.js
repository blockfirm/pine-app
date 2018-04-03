import * as Keychain from 'react-native-keychain';
import getMnemonicByKey from '../../../src/crypto/getMnemonicByKey';

describe('getMnemonicByKey', () => {
  beforeEach(() => {
    Keychain.getGenericPassword.mockClear();
  });

  it('is a function', () => {
    expect(typeof getMnemonicByKey).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getMnemonicByKey.length).toBe(1);
  });

  it('calls Keychain.getGenericPassword with service set to the key id', () => {
    const fakeKeyId = '7ee4c96a-fa62-43d6-953a-0d9a085c84fb';
    getMnemonicByKey(fakeKeyId);
    expect(Keychain.getGenericPassword).toBeCalledWith(fakeKeyId);
  });

  it('returns a promise that resolves to the password from Keychain.getGenericPassword', () => {
    Keychain.getGenericPassword.mockImplementationOnce(() => {
      return Promise.resolve({
        username: 'mnemonic',
        password: '7bd15886-a718-4462-9352-7a58b4305048'
      });
    });

    expect.hasAssertions();

    return getMnemonicByKey().then((mnemonic) => {
      expect(mnemonic).toBe('7bd15886-a718-4462-9352-7a58b4305048');
    });
  });

  describe('when no mnemonic could be found', () => {
    it('returns a rejected promise', () => {
      Keychain.getGenericPassword.mockImplementationOnce(() => {
        return Promise.resolve(false);
      });

      expect.hasAssertions();

      return getMnemonicByKey().catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
    });
  });
});
