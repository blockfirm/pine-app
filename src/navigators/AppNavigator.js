import { createStackNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import TermsAndConditionsNavigator from './TermsAndConditionsNavigator';
import SettingsNavigator from './SettingsNavigator';
import BackUpMnemonicNavigator from './BackUpMnemonicNavigator';
import SendNavigator from './SendNavigator';
import AddContactNavigator from './AddContactNavigator';

const AppNavigator = createStackNavigator({
  Main: { screen: MainNavigator },
  TermsAndConditions: { screen: TermsAndConditionsNavigator },
  Settings: { screen: SettingsNavigator },
  BackUpMnemonic: { screen: BackUpMnemonicNavigator },
  Send: { screen: SendNavigator },
  AddContact: { screen: AddContactNavigator }
}, {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'Main'
});

export default AppNavigator;
