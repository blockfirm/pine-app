// Inject node globals into React Native's global scope.
global.Buffer = require('buffer').Buffer;

global.process = require('process');
global.process.browser = false;

global.crypto = require('react-native-crypto');

const randomBytes = require('react-native-randombytes').randomBytes;

global.crypto.getRandomValues = function getRandomValues(array) {
  /*
   * The synchronous version of randomBytes will not use iOS's SecRandomCopyBytes.
   * Instead it will use the SJCL library which is not secure enough for private
   * key generation. This should only be used for things such as UUID generation etc.
   * <https://github.com/mvayngrib/react-native-randombytes>
   */
  const bytes = randomBytes(array.length);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes[i];
  }

  return array;
};
