import { createStackNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';
import TermsAndConditionsNavigator from './TermsAndConditionsNavigator';
import PrivacyPolicyNavigator from './PrivacyPolicyNavigator';
import SettingsNavigator from './SettingsNavigator';
import BackUpMnemonicNavigator from './BackUpMnemonicNavigator';
import AddContactNavigator from './AddContactNavigator';
import WalletBalanceNavigator from './WalletBalanceNavigator';
import AztecoNavigator from './AztecoNavigator';

const AppNavigator = createStackNavigator({
  Main: { screen: MainNavigator },
  TermsAndConditions: { screen: TermsAndConditionsNavigator },
  PrivacyPolicy: { screen: PrivacyPolicyNavigator },
  Settings: { screen: SettingsNavigator },
  BackUpMnemonic: { screen: BackUpMnemonicNavigator },
  AddContact: { screen: AddContactNavigator },
  WalletBalance: { screen: WalletBalanceNavigator },
  Azteco: { screen: AztecoNavigator }
}, {
  mode: 'modal',
  headerMode: 'none',
  initialRouteName: 'Main'
});

export default AppNavigator;
