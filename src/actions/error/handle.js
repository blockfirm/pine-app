import { Alert } from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import { dismiss } from './dismiss';

const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred. Please try again or contact support.';

export const ERROR_HANDLE = 'ERROR_HANDLE';

export const handle = (error) => {
  const errorMessage = error && error.message;

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
