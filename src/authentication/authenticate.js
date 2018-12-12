import TouchID from 'react-native-touch-id';

const authenticate = () => {
  const options = {
    passcodeFallback: true, // Use passcode if the user doesn't have Touch ID or Face ID.
    fallbackLabel: ''
  };

  return TouchID.authenticate(null, options)
    .then(() => {
      return true;
    })
    .catch((error) => {
      switch (error.name) {
        case 'LAErrorPasscodeNotSet':
        case 'LAErrorTouchIDNotAvailable':
        case 'LAErrorTouchIDNotEnrolled':
        case 'RCTTouchIDNotSupported':
          /**
           * If the user doesn't have any way of authenticating
           * then treat it as success.
           */
          return true;
      }

      // All other errors will fail the authentication.
      return false;
    });
};

export default authenticate;
