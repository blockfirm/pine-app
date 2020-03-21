import WalletBalanceScreen from '../screens/settings/WalletBalanceScreen';
import OnChainBalanceScreen from '../screens/settings/OnChainBalanceScreen';
import OffChainBalanceScreen from '../screens/settings/OffChainBalanceScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const WalletBalanceNavigator = createDismissableStackNavigator({
  WalletBalance: { screen: WalletBalanceScreen },
  OnChainBalance: { screen: OnChainBalanceScreen },
  OffChainBalance: { screen: OffChainBalanceScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'WalletBalance'
});

export default WalletBalanceNavigator;
