import { StackNavigator } from 'react-navigation';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';

// eslint-disable-next-line new-cap
const AppNavigator = StackNavigator({
  Splash: { screen: SplashScreen },
  Welcome: { screen: WelcomeScreen },
  Home: { screen: HomeScreen }
});

export default AppNavigator;
