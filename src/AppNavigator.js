import { StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';

// eslint-disable-next-line new-cap
const AppNavigator = StackNavigator({
  Home: {
    screen: HomeScreen
  }
});

export default AppNavigator;
