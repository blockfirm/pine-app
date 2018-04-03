import * as Keychain from 'react-native-keychain';

export default function removeMnemonicByKey(keyId) {
  const service = keyId;
  return Keychain.resetGenericPassword(service);
}
