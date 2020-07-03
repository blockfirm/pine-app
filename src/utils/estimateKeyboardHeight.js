import { Dimensions } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const WINDOW_HEIGHT_TO_KEYBOARD_HEIGHT = {
  568: 216,
  667: 216,
  736: 226,
  812: 291,
  896: 301
};

const DEFAULT_KEYBOARD_HEIGHT = 291;

const estimateKeyboardHeight = () => {
  return WINDOW_HEIGHT_TO_KEYBOARD_HEIGHT[WINDOW_HEIGHT] || DEFAULT_KEYBOARD_HEIGHT;
};

export default estimateKeyboardHeight;
