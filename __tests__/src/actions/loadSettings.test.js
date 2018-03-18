import { Settings } from 'react-native';
import {
  loadSettings,
  LOAD_SETTINGS_REQUEST,
  LOAD_SETTINGS_SUCCESS,
  LOAD_SETTINGS_FAILURE
} from '../../../src/actions/loadSettings';
import config from '../../../src/config';

const SETTINGS_KEY = 'settings';
const dispatchMock = jest.fn();

describe('LOAD_SETTINGS_REQUEST', () => {
  it('equals "LOAD_SETTINGS_REQUEST"', () => {
    expect(LOAD_SETTINGS_REQUEST).toBe('LOAD_SETTINGS_REQUEST');
  });
});

describe('LOAD_SETTINGS_SUCCESS', () => {
  it('equals "LOAD_SETTINGS_SUCCESS"', () => {
    expect(LOAD_SETTINGS_SUCCESS).toBe('LOAD_SETTINGS_SUCCESS');
  });
});

describe('LOAD_SETTINGS_FAILURE', () => {
  it('equals "LOAD_SETTINGS_FAILURE"', () => {
    expect(LOAD_SETTINGS_FAILURE).toBe('LOAD_SETTINGS_FAILURE');
  });
});

describe('loadSettings', () => {
  beforeEach(() => {
    Settings.get.mockClear();
  });

  it('is a function', () => {
    expect(typeof loadSettings).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(loadSettings.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = loadSettings();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = loadSettings();
    });

    it('dispatches an action of type LOAD_SETTINGS_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: LOAD_SETTINGS_REQUEST
      });
    });

    it('gets the settings with Settings.get()', () => {
      returnedFunction(dispatchMock);

      expect(Settings.get).toHaveBeenCalledTimes(1);
      expect(Settings.get).toHaveBeenCalledWith(SETTINGS_KEY);
    });

    it('dispatches an action of type LOAD_SETTINGS_SUCCESS with the settings', () => {
      const expectedSettings = config;

      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: LOAD_SETTINGS_SUCCESS,
        settings: expectedSettings
      });
    });

    it('returns an object', () => {
      const returnValue = returnedFunction(dispatchMock);
      expect(typeof returnValue).toBe('object');
    });

    describe('when settings has been set', () => {
      beforeEach(() => {
        // Return some settings from Settings.get().
        Settings.get.mockImplementationOnce(() => ({
          bitcoin: {
            unit: '04cbb189-1488-4f6a-8c1a-a2716fd48d93'
          }
        }));
      });

      it('overrides the settings specified in config.js', () => {
        const settings = returnedFunction(dispatchMock);

        expect(typeof settings).toBe('object');
        expect(settings.bitcoin.unit).toBe('04cbb189-1488-4f6a-8c1a-a2716fd48d93');
        expect(settings.bitcoin.network).toBe(config.bitcoin.network);
      });
    });

    describe('when settings is undefined', () => {
      beforeEach(() => {
        // Return undefined from Settings.get().
        Settings.get.mockImplementationOnce(() => undefined);
      });

      it('defaults to the settings in config.js', () => {
        const settings = returnedFunction(dispatchMock);

        expect(typeof settings).toBe('object');
        expect(settings).toMatchObject(config);
      });
    });

    describe('when the function fails', () => {
      beforeEach(() => {
        // Make the function fail by throwing an error in Settings.get().
        Settings.get.mockImplementationOnce(() => {
          throw new Error('9a75627c-865b-4faf-811b-b598a78c392d');
        });
      });

      it('throws an error', () => {
        const dispatchAction = () => {
          loadSettings()(dispatchMock);
        };

        expect(dispatchAction).toThrowError('9a75627c-865b-4faf-811b-b598a78c392d');
      });

      it('dispatches an action of type LOAD_SETTINGS_FAILURE with the error', () => {
        expect.hasAssertions();

        try {
          loadSettings()(dispatchMock);
        } catch (error) {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: LOAD_SETTINGS_FAILURE,
            error
          });
        }
      });
    });
  });
});
