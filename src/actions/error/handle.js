import { Alert } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import { dismiss } from './dismiss';

const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred. Please try again or contact support.';

export const ERROR_HANDLE = 'ERROR_HANDLE';

const addPeriod = (message) => {
  if (!message) {
    return message;
  }

  // Add period (.) if message ends with letter a-z.
  if (/[a-z]$/.test(message.trim())) {
    return `${message.trim()}.`;
  }

  return message;
};

export const handle = (error) => {
  const errorMessage = error && addPeriod(error.message);

  ReactNativeHaptic.generate('notificationError');

  return (dispatch) => {
    Alert.alert(
      'Error',
      errorMessage || UNKNOWN_ERROR_MESSAGE,
      [
        {
          text: 'OK',
          onPress: () => dispatch(dismiss())
        }
      ]
    );

    dispatch({ type: ERROR_HANDLE, error });
  };
};
