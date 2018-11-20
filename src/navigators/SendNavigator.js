import EnterAmountScreen from '../screens/EnterAmountScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const SendNavigator = createDismissableStackNavigator({
  EnterAmount: { screen: EnterAmountScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'EnterAmount'
});

export default SendNavigator;
