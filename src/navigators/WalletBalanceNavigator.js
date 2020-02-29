import WalletBalanceScreen from '../screens/settings/WalletBalanceScreen';
import OnChainBalanceScreen from '../screens/settings/OnChainBalanceScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const WalletBalanceNavigator = createDismissableStackNavigator({
  WalletBalance: { screen: WalletBalanceScreen },
  OnChainBalance: { screen: OnChainBalanceScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'WalletBalance'
});

export default WalletBalanceNavigator;
