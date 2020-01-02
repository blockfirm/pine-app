import ChangePineServerScreen from '../screens/settings/ChangePineServerScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const ChangePineServerNavigator = createDismissableStackNavigator({
  ChangePineServer: { screen: ChangePineServerScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'ChangePineServer'
});

export default ChangePineServerNavigator;
