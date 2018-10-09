import { ifIphoneX } from 'react-native-iphone-x-helper';

const STATUS_BAR_HEIGHT = ifIphoneX(44, 20);

const getStatusBarHeight = () => {
  return STATUS_BAR_HEIGHT;
};

export default getStatusBarHeight;
