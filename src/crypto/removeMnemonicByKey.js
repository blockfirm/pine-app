import * as Keychain from 'react-native-keychain';

const removeMnemonicByKey = (keyId) => {
  const service = keyId;
  return Keychain.resetGenericPassword(service);
};

export default removeMnemonicByKey;
