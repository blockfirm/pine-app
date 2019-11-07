import RedeemAztecoScreen from '../screens/azteco/RedeemAztecoScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const AztecoNavigator = createDismissableStackNavigator({
  RedeemAzteco: { screen: RedeemAztecoScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'RedeemAzteco'
});

export default AztecoNavigator;
