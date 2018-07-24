import * as Keychain from 'react-native-keychain';

const saveMnemonicByKey = (mnemonic, keyId) => {
  const username = 'mnemonic';
  const password = mnemonic;
  const service = keyId;

  return Keychain.setGenericPassword(username, password, service);
};

export default saveMnemonicByKey;
