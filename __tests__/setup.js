import { NativeModules } from 'react-native';

Object.defineProperty(NativeModules.UIManager, 'RCTView', {
  get: () => ({
    NativeProps: {},
    directEventTypes: []
  })
});

NativeModules.RNGestureHandlerModule = NativeModules.RNGestureHandlerModule || {
  State: { BEGAN: 'BEGAN', FAILED: 'FAILED', ACTIVE: 'ACTIVE', END: 'END' }
};

NativeModules.PlatformConstants = {
  forceTouchAvailable: false
};

jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));

jest.mock('../src/config');
