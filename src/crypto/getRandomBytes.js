import { randomBytes } from 'react-native-randombytes';

const getRandomBytes = (size) => {
  return new Promise((resolve, reject) => {
    /*
     * It's very important to keep this call asynchronous. The synchronous version
     * of randomBytes will not use iOS's SecRandomCopyBytes. Instead it will use
     * the SJCL library which is not secure enough for private key generation.
     * <https://github.com/mvayngrib/react-native-randombytes>
     */
    randomBytes(size, (error, bytes) => {
      if (error) {
        return reject(error);
      }

      resolve(bytes);
    });
  });
};

export default getRandomBytes;
