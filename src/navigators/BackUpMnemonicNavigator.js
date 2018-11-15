import MnemonicScreen from '../screens/MnemonicScreen';
import ConfirmMnemonicScreen from '../screens/ConfirmMnemonicScreen';

import createDismissableStackNavigator from '../createDismissableStackNavigator';

const BackUpMnemonicNavigator = createDismissableStackNavigator({
  MnemonicModal: { screen: MnemonicScreen },
  ConfirmMnemonicModal: { screen: ConfirmMnemonicScreen }
}, {
  headerMode: 'float'
});

export default BackUpMnemonicNavigator;
