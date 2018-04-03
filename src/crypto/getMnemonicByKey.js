import * as Keychain from 'react-native-keychain';

export default function getMnemonicByKey(keyId) {
  const service = keyId;
  return Keychain.getGenericPassword(service);
}
