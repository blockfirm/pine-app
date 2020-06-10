import OpenLightningChannelScreen from '../screens/settings/OpenLightningChannelScreen';
import OpeningChannelScreen from '../screens/settings/OpeningChannelScreen';
import createDismissableStackNavigator from '../createDismissableStackNavigator';

const OpenLightningChannelNavigator = createDismissableStackNavigator({
  OpenLightningChannel: { screen: OpenLightningChannelScreen },
  OpeningChannel: { screen: OpeningChannelScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'OpenLightningChannel'
});

export default OpenLightningChannelNavigator;
