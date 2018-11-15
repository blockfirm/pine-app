import SettingsScreen from '../screens/settings/SettingsScreen';
import GeneralSettingsScreen from '../screens/settings/GeneralSettingsScreen';
import SecurityAndPrivacySettingsScreen from '../screens/settings/SecurityAndPrivacySettingsScreen';
import BitcoinSettingsScreen from '../screens/settings/BitcoinSettingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import TermsAndConditionsScreen from '../screens/settings/TermsAndConditionsScreen';
import ServiceUrlScreen from '../screens/settings/ServiceUrlScreen';
import BitcoinUnitScreen from '../screens/settings/BitcoinUnitScreen';
import BitcoinFeeSettingsScreen from '../screens/settings/BitcoinFeeSettingsScreen';
import SatoshisPerByteScreen from '../screens/settings/SatoshisPerByteScreen';
import ShowMnemonicScreen from '../screens/settings/ShowMnemonicScreen';

import createDismissableStackNavigator from '../createDismissableStackNavigator';

const SettingsCardNavigator = createDismissableStackNavigator({
  Settings: { screen: SettingsScreen },
  GeneralSettings: { screen: GeneralSettingsScreen },
  SecurityAndPrivacySettings: { screen: SecurityAndPrivacySettingsScreen },
  BitcoinSettings: { screen: BitcoinSettingsScreen },
  About: { screen: AboutScreen },
  TermsAndConditions: { screen: TermsAndConditionsScreen },
  ServiceUrl: { screen: ServiceUrlScreen },
  BitcoinUnit: { screen: BitcoinUnitScreen },
  BitcoinFeeSettings: { screen: BitcoinFeeSettingsScreen },
  SatoshisPerByte: { screen: SatoshisPerByteScreen },
  ShowMnemonic: { screen: ShowMnemonicScreen }
}, {
  headerMode: 'float'
});

export default SettingsCardNavigator;
