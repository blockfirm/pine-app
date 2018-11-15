import MnemonicScreen from '../screens/MnemonicScreen';
import ConfirmMnemonicScreen from '../screens/ConfirmMnemonicScreen';
import TermsAndConditionsScreen from '../screens/settings/TermsAndConditionsScreen';

import createDismissableStackNavigator from '../createDismissableStackNavigator';

const ModalNavigator = createDismissableStackNavigator({
  TermsAndConditionsModal: { screen: TermsAndConditionsScreen },
  MnemonicModal: { screen: MnemonicScreen },
  ConfirmMnemonicModal: { screen: ConfirmMnemonicScreen }
}, {
  headerMode: 'float'
});

export default ModalNavigator;
