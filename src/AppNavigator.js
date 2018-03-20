import { StackNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';

// eslint-disable-next-line new-cap
const AppNavigator = StackNavigator({
  Splash: { screen: SplashScreen },
  Home: { screen: HomeScreen }
});

export default AppNavigator;
