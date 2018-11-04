import { createStackNavigator } from 'react-navigation';

import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MnemonicScreen from './screens/MnemonicScreen';
import ConfirmMnemonicScreen from './screens/ConfirmMnemonicScreen';
import ImportMnemonicScreen from './screens/ImportMnemonicScreen';
import DisclaimerScreen from './screens/DisclaimerScreen';
import HomeScreen from './screens/HomeScreen';

import SettingsScreen from './screens/settings/SettingsScreen';
import GeneralSettingsScreen from './screens/settings/GeneralSettingsScreen';
import SecurityAndPrivacySettingsScreen from './screens/settings/SecurityAndPrivacySettingsScreen';
import BitcoinSettingsScreen from './screens/settings/BitcoinSettingsScreen';
import AboutScreen from './screens/settings/AboutScreen';
import TermsAndConditionsScreen from './screens/settings/TermsAndConditionsScreen';
import ServiceUrlScreen from './screens/settings/ServiceUrlScreen';
import BitcoinUnitScreen from './screens/settings/BitcoinUnitScreen';
import BitcoinFeeSettingsScreen from './screens/settings/BitcoinFeeSettingsScreen';
import SatoshisPerByteScreen from './screens/settings/SatoshisPerByteScreen';
import ShowMnemonicScreen from './screens/settings/ShowMnemonicScreen';

import createDismissableStackNavigator from './createDismissableStackNavigator';

const MainCardNavigator = createStackNavigator({
  Splash: { screen: SplashScreen },
  Welcome: { screen: WelcomeScreen },
  Mnemonic: { screen: MnemonicScreen },
  ConfirmMnemonic: { screen: ConfirmMnemonicScreen },
  ImportMnemonic: { screen: ImportMnemonicScreen },
  Disclaimer: { screen: DisclaimerScreen },
  Home: { screen: HomeScreen }
}, {
  headerMode: 'screen'
});

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

const ModalNavigator = createDismissableStackNavigator({
  TermsAndConditionsModal: { screen: TermsAndConditionsScreen },
  MnemonicModal: { screen: MnemonicScreen },
  ConfirmMnemonicModal: { screen: ConfirmMnemonicScreen }
}, {
  headerMode: 'float'
});

const MainModalNavigator = createStackNavigator({
  MainCardNavigator: { screen: MainCardNavigator },
  SettingsCardNavigator: { screen: SettingsCardNavigator },
  ModalNavigator: { screen: ModalNavigator }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default MainModalNavigator;
