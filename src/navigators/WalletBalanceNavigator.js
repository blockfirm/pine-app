import WalletBalanceScreen from '../screens/settings/WalletBalanceScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const WalletBalanceNavigator = createDismissableStackNavigator({
  WalletBalance: { screen: WalletBalanceScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'WalletBalance'
});

export default WalletBalanceNavigator;
