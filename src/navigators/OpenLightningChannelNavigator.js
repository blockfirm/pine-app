import OpenLightningChannelScreen from '../screens/settings/OpenLightningChannelScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const OpenLightningChannelNavigator = createDismissableStackNavigator({
  OpenLightningChannel: { screen: OpenLightningChannelScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'OpenLightningChannel'
});

export default OpenLightningChannelNavigator;
