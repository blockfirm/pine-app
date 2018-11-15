import TermsAndConditionsScreen from '../screens/settings/TermsAndConditionsScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const TermsAndConditionsNavigator = createDismissableStackNavigator({
  TermsAndConditions: { screen: TermsAndConditionsScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'TermsAndConditions'
});

export default TermsAndConditionsNavigator;
