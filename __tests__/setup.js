import * as ReactNative from 'react-native';

jest.mock('../src/config');

jest.mock('react-native-vector-icons/Ionicons', () => 'IoniconIcon');
jest.mock('react-native-vector-icons/Octicons', () => 'OcticonIcon');
jest.mock('react-native-vector-icons/Entypo', () => 'EntypoIcon');

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const TurboModuleRegistry = require.requireActual(
    'react-native/Libraries/TurboModule/TurboModuleRegistry'
  );

  return {
    ...TurboModuleRegistry,
    getEnforcing: function (name) {
      if (name === 'SettingsManager') {
        const NativeSettingsManager = require.requireActual(
          'react-native/Libraries/Settings/NativeSettingsManager'
        );

        return {
          ...NativeSettingsManager,
          getConstants: () => ({ settings: {} })
        };
      }

      return TurboModuleRegistry.getEnforcing(...arguments);
    }
  };
});

jest.mock('react-native/Libraries/Settings/Settings', () => {
  const Settings = require.requireActual(
    'react-native/Libraries/Settings/Settings'
  );

  return {
    ...Settings,
    get: jest.fn(() => ({})),
    set: jest.fn(() => {})
  };
});

jest.mock('react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo', () => {
  const AccessibilityInfo = require.requireActual(
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo'
  );

  return {
    ...AccessibilityInfo,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    isReduceTransparencyEnabled: jest.fn(() => Promise.resolve(false))
  };
});

jest.doMock('react-native', () => {
  const NativeSettingsManager = require.requireActual(
    'react-native/Libraries/Settings/NativeSettingsManager'
  );

  return Object.setPrototypeOf(
    {
      NativeModules: {
        ...ReactNative.NativeModules,
        SettingsManager: {
          ...NativeSettingsManager,
          settings: {
            AppleLocale: 'en_US'
          }
        }
      }
    },
    ReactNative
  );
});
