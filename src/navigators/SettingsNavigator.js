import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import DisplayNameScreen from '../screens/settings/DisplayNameScreen';
import GeneralSettingsScreen from '../screens/settings/GeneralSettingsScreen';
import BitcoinSettingsScreen from '../screens/settings/BitcoinSettingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import TermsAndConditionsScreen from '../screens/settings/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';
import BitcoinServiceScreen from '../screens/settings/BitcoinServiceScreen';
import ServiceUrlScreen from '../screens/settings/ServiceUrlScreen';
import BitcoinUnitScreen from '../screens/settings/BitcoinUnitScreen';
import BitcoinFeeSettingsScreen from '../screens/settings/BitcoinFeeSettingsScreen';
import SatoshisPerByteScreen from '../screens/settings/SatoshisPerByteScreen';
import RecoveryKeyScreen from '../screens/settings/RecoveryKeyScreen';
import SelectCurrencyScreen from '../screens/settings/SelectCurrencyScreen';
import LightningSettingsScreen from '../screens/settings/LightningSettingsScreen';
import OnChainBalanceScreen from '../screens/settings/OnChainBalanceScreen';
import OffChainBalanceScreen from '../screens/settings/OffChainBalanceScreen';
import BetaSettingsScreen from '../screens/settings/BetaSettingsScreen';
import AboutBetaScreen from '../screens/settings/AboutBetaScreen';
import LogsScreen from '../screens/settings/LogsScreen';
import LogDetailsScreen from '../screens/settings/LogDetailsScreen';

import createDismissableStackNavigator from '../createDismissableStackNavigator';

const SettingsNavigator = createDismissableStackNavigator({
  Settings: { screen: SettingsScreen },
  Profile: { screen: ProfileScreen },
  DisplayName: { screen: DisplayNameScreen },
  GeneralSettings: { screen: GeneralSettingsScreen },
  BitcoinSettings: { screen: BitcoinSettingsScreen },
  About: { screen: AboutScreen },
  TermsAndConditions: { screen: TermsAndConditionsScreen },
  PrivacyPolicy: { screen: PrivacyPolicyScreen },
  BitcoinService: { screen: BitcoinServiceScreen },
  ServiceUrl: { screen: ServiceUrlScreen },
  BitcoinUnit: { screen: BitcoinUnitScreen },
  BitcoinFeeSettings: { screen: BitcoinFeeSettingsScreen },
  SatoshisPerByte: { screen: SatoshisPerByteScreen },
  RecoveryKey: { screen: RecoveryKeyScreen },
  SelectCurrency: { screen: SelectCurrencyScreen },
  LightningSettings: { screen: LightningSettingsScreen },
  OnChainBalance: { screen: OnChainBalanceScreen },
  OffChainBalance: { screen: OffChainBalanceScreen },
  BetaSettings: { screen: BetaSettingsScreen },
  AboutBeta: { screen: AboutBetaScreen },
  Logs: { screen: LogsScreen },
  LogDetails: { screen: LogDetailsScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'Settings'
});

export default SettingsNavigator;
