import TermsAndConditionsScreen from '../screens/settings/TermsAndConditionsScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const TermsAndConditionsModalNavigator = createDismissableStackNavigator({
  TermsAndConditionsModal: { screen: TermsAndConditionsScreen }
}, {
  headerMode: 'float'
});

export default TermsAndConditionsModalNavigator;
