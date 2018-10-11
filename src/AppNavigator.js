import { StackNavigator } from 'react-navigation';

import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MnemonicScreen from './screens/MnemonicScreen';
import ConfirmMnemonicScreen from './screens/ConfirmMnemonicScreen';
import ImportMnemonicScreen from './screens/ImportMnemonicScreen';
import DisclaimerScreen from './screens/DisclaimerScreen';
import HomeScreen from './screens/HomeScreen';

import SettingsScreen from './screens/settings/SettingsScreen';
import AboutScreen from './screens/settings/AboutScreen';
import TermsAndConditionsScreen from './screens/settings/TermsAndConditionsScreen';
import ServiceUrlScreen from './screens/settings/ServiceUrlScreen';
import BitcoinUnitScreen from './screens/settings/BitcoinUnitScreen';
import BitcoinFeeSettingsScreen from './screens/settings/BitcoinFeeSettingsScreen';
import SatoshisPerByteScreen from './screens/settings/SatoshisPerByteScreen';
import ShowMnemonicScreen from './screens/settings/ShowMnemonicScreen';

import DismissableStackNavigator from './DismissableStackNavigator';

// eslint-disable-next-line new-cap
const MainCardNavigator = StackNavigator({
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

// eslint-disable-next-line new-cap
const SettingsCardNavigator = DismissableStackNavigator({
  Settings: { screen: SettingsScreen },
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

// eslint-disable-next-line new-cap
const ModalNavigator = DismissableStackNavigator({
  TermsAndConditionsModal: { screen: TermsAndConditionsScreen }
}, {
  headerMode: 'float'
});

// eslint-disable-next-line new-cap
const MainModalNavigator = StackNavigator({
  MainCardNavigator: { screen: MainCardNavigator },
  SettingsCardNavigator: { screen: SettingsCardNavigator },
  ModalNavigator: { screen: ModalNavigator }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default MainModalNavigator;
