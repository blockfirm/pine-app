import OnChainBalanceScreen from '../screens/settings/OnChainBalanceScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const WalletBalanceNavigator = createDismissableStackNavigator({
  OnChainBalance: { screen: OnChainBalanceScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'OnChainBalance'
});

export default WalletBalanceNavigator;
