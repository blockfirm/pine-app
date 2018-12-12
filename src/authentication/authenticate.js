import TouchID from 'react-native-touch-id';

const authenticate = () => {
  const options = {
    passcodeFallback: true
  };

  return TouchID.authenticate(null, options)
    .then(() => {
      return true;
    })
    .catch((error) => {
      /**
       * If the user doesn't have any way of authenticating
       * then treat it as success. All other errors will fail
       * the authentication.
       */
      switch (error.name) {
        case 'LAErrorPasscodeNotSet':
        case 'LAErrorTouchIDNotAvailable':
        case 'LAErrorTouchIDNotEnrolled':
        case 'RCTTouchIDNotSupported':
          return true;
      }

      return false;
    });
};

export default authenticate;
