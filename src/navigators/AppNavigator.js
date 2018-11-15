import { createStackNavigator } from 'react-navigation';

import MainCardNavigator from './MainCardNavigator';
import ModalNavigator from './ModalNavigator';
import SettingsCardNavigator from './SettingsCardNavigator';

const AppNavigator = createStackNavigator({
  MainCardNavigator: { screen: MainCardNavigator },
  ModalNavigator: { screen: ModalNavigator },
  SettingsCardNavigator: { screen: SettingsCardNavigator }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default AppNavigator;
