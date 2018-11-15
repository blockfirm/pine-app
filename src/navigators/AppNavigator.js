import { createStackNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import TermsAndConditionsModalNavigator from './TermsAndConditionsModalNavigator';
import SettingsNavigator from './SettingsNavigator';
import BackUpMnemonicNavigator from './BackUpMnemonicNavigator';

const AppNavigator = createStackNavigator({
  MainNavigator: { screen: MainNavigator },
  TermsAndConditionsModalNavigator: { screen: TermsAndConditionsModalNavigator },
  SettingsNavigator: { screen: SettingsNavigator },
  BackUpMnemonicNavigator: { screen: BackUpMnemonicNavigator }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default AppNavigator;
