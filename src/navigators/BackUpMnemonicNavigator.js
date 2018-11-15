import MnemonicScreen from '../screens/MnemonicScreen';
import ConfirmMnemonicScreen from '../screens/ConfirmMnemonicScreen';

import createDismissableStackNavigator from '../createDismissableStackNavigator';

const BackUpMnemonicNavigator = createDismissableStackNavigator({
  Mnemonic: { screen: MnemonicScreen },
  ConfirmMnemonic: { screen: ConfirmMnemonicScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'Mnemonic'
});

export default BackUpMnemonicNavigator;
