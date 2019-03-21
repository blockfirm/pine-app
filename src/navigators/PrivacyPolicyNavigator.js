import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const PrivacyPolicyNavigator = createDismissableStackNavigator({
  PrivacyPolicy: { screen: PrivacyPolicyScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'PrivacyPolicy'
});

export default PrivacyPolicyNavigator;
