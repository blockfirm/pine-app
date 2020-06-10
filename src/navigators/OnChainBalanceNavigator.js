import OnChainBalanceScreen from '../screens/settings/OnChainBalanceScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const OnChainBalanceNavigator = createDismissableStackNavigator({
  OnChainBalance: { screen: OnChainBalanceScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'OnChainBalance'
});

export default OnChainBalanceNavigator;
