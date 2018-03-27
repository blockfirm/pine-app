import Reactotron, { asyncStorage } from 'reactotron-react-native';

if (__DEV__) {
  Reactotron
    .configure()
    .useReactNative()
    .use(asyncStorage())
    .connect();
}
