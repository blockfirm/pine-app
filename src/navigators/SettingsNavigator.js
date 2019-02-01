import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import GeneralSettingsScreen from '../screens/settings/GeneralSettingsScreen';
import SecurityAndPrivacySettingsScreen from '../screens/settings/SecurityAndPrivacySettingsScreen';
import BitcoinSettingsScreen from '../screens/settings/BitcoinSettingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import TermsAndConditionsScreen from '../screens/settings/TermsAndConditionsScreen';
import BitcoinServiceScreen from '../screens/settings/BitcoinServiceScreen';
import ServiceUrlScreen from '../screens/settings/ServiceUrlScreen';
import BitcoinUnitScreen from '../screens/settings/BitcoinUnitScreen';
import BitcoinFeeSettingsScreen from '../screens/settings/BitcoinFeeSettingsScreen';
import SatoshisPerByteScreen from '../screens/settings/SatoshisPerByteScreen';
import RecoveryKeyScreen from '../screens/settings/RecoveryKeyScreen';
import SelectCurrencyScreen from '../screens/settings/SelectCurrencyScreen';

import createDismissableStackNavigator from '../createDismissableStackNavigator';

const SettingsNavigator = createDismissableStackNavigator({
  Settings: { screen: SettingsScreen },
  Profile: { screen: ProfileScreen },
  GeneralSettings: { screen: GeneralSettingsScreen },
  SecurityAndPrivacySettings: { screen: SecurityAndPrivacySettingsScreen },
  BitcoinSettings: { screen: BitcoinSettingsScreen },
  About: { screen: AboutScreen },
  TermsAndConditions: { screen: TermsAndConditionsScreen },
  BitcoinService: { screen: BitcoinServiceScreen },
  ServiceUrl: { screen: ServiceUrlScreen },
  BitcoinUnit: { screen: BitcoinUnitScreen },
  BitcoinFeeSettings: { screen: BitcoinFeeSettingsScreen },
  SatoshisPerByte: { screen: SatoshisPerByteScreen },
  RecoveryKey: { screen: RecoveryKeyScreen },
  SelectCurrency: { screen: SelectCurrencyScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'Settings'
});

export default SettingsNavigator;
