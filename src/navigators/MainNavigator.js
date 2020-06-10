import { createStackNavigator } from 'react-navigation';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import MnemonicScreen from '../screens/MnemonicScreen';
import ConfirmMnemonicScreen from '../screens/ConfirmMnemonicScreen';
import ImportMnemonicScreen from '../screens/ImportMnemonicScreen';
import RecoverScreen from '../screens/RecoverScreen';
import CreatePineAddressScreen from '../screens/CreatePineAddressScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeAnimationScreen from '../screens/HomeAnimationScreen';
import PaymentDetailsScreen from '../screens/PaymentDetailsScreen';
import ConversationScreen from '../screens/ConversationScreen';
import ResetScreen from '../screens/ResetScreen';
import TurnOnNotificationsScreen from '../screens/TurnOnNotificationsScreen';
import ActivateLightningScreen from '../screens/ActivateLightningScreen';
import ActivatingLightningScreen from '../screens/ActivatingLightningScreen';
import LightningSetupCompleteScreen from '../screens/LightningSetupCompleteScreen';

const MainNavigator = createStackNavigator({
  Splash: { screen: SplashScreen },
  Welcome: { screen: WelcomeScreen },
  Mnemonic: { screen: MnemonicScreen },
  ConfirmMnemonic: { screen: ConfirmMnemonicScreen },
  ImportMnemonic: { screen: ImportMnemonicScreen },
  Recover: { screen: RecoverScreen },
  CreatePineAddress: { screen: CreatePineAddressScreen },
  Disclaimer: { screen: DisclaimerScreen },
  Home: { screen: HomeScreen },
  HomeAnimation: { screen: HomeAnimationScreen },
  PaymentDetails: { screen: PaymentDetailsScreen },
  Conversation: { screen: ConversationScreen },
  Reset: { screen: ResetScreen },
  TurnOnNotifications: { screen: TurnOnNotificationsScreen },
  ActivateLightning: { screen: ActivateLightningScreen },
  ActivatingLightning: { screen: ActivatingLightningScreen },
  LightningSetupComplete: { screen: LightningSetupCompleteScreen }
}, {
  headerMode: 'screen',
  initialRouteName: 'Splash'
});

export default MainNavigator;
