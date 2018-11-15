import { createStackNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import ModalNavigator from './ModalNavigator';
import SettingsNavigator from './SettingsNavigator';

const AppNavigator = createStackNavigator({
  MainNavigator: { screen: MainNavigator },
  ModalNavigator: { screen: ModalNavigator },
  SettingsNavigator: { screen: SettingsNavigator }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default AppNavigator;
