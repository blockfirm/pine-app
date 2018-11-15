import { createStackNavigator } from 'react-navigation';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import MnemonicScreen from '../screens/MnemonicScreen';
import ConfirmMnemonicScreen from '../screens/ConfirmMnemonicScreen';
import ImportMnemonicScreen from '../screens/ImportMnemonicScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import HomeScreen from '../screens/HomeScreen';

const MainNavigator = createStackNavigator({
  Splash: { screen: SplashScreen },
  Welcome: { screen: WelcomeScreen },
  Mnemonic: { screen: MnemonicScreen },
  ConfirmMnemonic: { screen: ConfirmMnemonicScreen },
  ImportMnemonic: { screen: ImportMnemonicScreen },
  Disclaimer: { screen: DisclaimerScreen },
  Home: { screen: HomeScreen }
}, {
  headerMode: 'screen',
  initialRouteName: 'Splash'
});

export default MainNavigator;
