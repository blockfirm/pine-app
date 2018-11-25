import EnterAmountScreen from '../screens/EnterAmountScreen';
import ReviewAndPayScreen from '../screens/ReviewAndPayScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const SendNavigator = createDismissableStackNavigator({
  EnterAmount: { screen: EnterAmountScreen },
  ReviewAndPay: { screen: ReviewAndPayScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'EnterAmount'
});

export default SendNavigator;
