import { createStackNavigator } from 'react-navigation';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import MnemonicScreen from '../screens/MnemonicScreen';
import ConfirmMnemonicScreen from '../screens/ConfirmMnemonicScreen';
import ImportMnemonicScreen from '../screens/ImportMnemonicScreen';
import CreatePineAddressScreen from '../screens/CreatePineAddressScreen';
import DisclaimerScreen from '../screens/DisclaimerScreen';
import HomeScreen from '../screens/HomeScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import PaymentDetailsScreen from '../screens/PaymentDetailsScreen';
import ConversationScreen from '../screens/ConversationScreen';

const MainNavigator = createStackNavigator({
  Splash: { screen: SplashScreen },
  Welcome: { screen: WelcomeScreen },
  Mnemonic: { screen: MnemonicScreen },
  ConfirmMnemonic: { screen: ConfirmMnemonicScreen },
  ImportMnemonic: { screen: ImportMnemonicScreen },
  CreatePineAddress: { screen: CreatePineAddressScreen },
  Disclaimer: { screen: DisclaimerScreen },
  Home: { screen: HomeScreen },
  TransactionDetails: { screen: TransactionDetailsScreen },
  PaymentDetails: { screen: PaymentDetailsScreen },
  Conversation: { screen: ConversationScreen }
}, {
  headerMode: 'screen',
  initialRouteName: 'Splash'
});

export default MainNavigator;
