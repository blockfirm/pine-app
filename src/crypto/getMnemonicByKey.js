import * as Keychain from 'react-native-keychain';

const getMnemonicByKey = (keyId) => {
  const service = keyId;

  return Keychain.getGenericPassword(service).then((credentials) => {
    if (!credentials) {
      throw new Error('No mnemonic was found for the specified key ID.');
    }

    return credentials.password;
  });
};

export default getMnemonicByKey;
