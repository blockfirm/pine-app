import { Settings } from 'react-native';
import { loadSettings } from '../../../src/actions/loadSettings';
import {
  resetSettings,
  RESET_SETTINGS_REQUEST,
  RESET_SETTINGS_SUCCESS,
  RESET_SETTINGS_FAILURE
} from '../../../src/actions/resetSettings';

const dispatchMock = jest.fn();

jest.mock('../../../src/actions/loadSettings', () => ({
  loadSettings: jest.fn()
}));

describe('RESET_SETTINGS_REQUEST', () => {
  it('equals "RESET_SETTINGS_REQUEST"', () => {
    expect(RESET_SETTINGS_REQUEST).toBe('RESET_SETTINGS_REQUEST');
  });
});

describe('RESET_SETTINGS_SUCCESS', () => {
  it('equals "RESET_SETTINGS_SUCCESS"', () => {
    expect(RESET_SETTINGS_SUCCESS).toBe('RESET_SETTINGS_SUCCESS');
  });
});

describe('RESET_SETTINGS_FAILURE', () => {
  it('equals "RESET_SETTINGS_FAILURE"', () => {
    expect(RESET_SETTINGS_FAILURE).toBe('RESET_SETTINGS_FAILURE');
  });
});

describe('resetSettings', () => {
  beforeEach(() => {
    Settings.set.mockClear();
    loadSettings.mockClear();
  });

  it('is a function', () => {
    expect(typeof resetSettings).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(resetSettings.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = resetSettings();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = resetSettings();
    });

    it('dispatches an action of type RESET_SETTINGS_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: RESET_SETTINGS_REQUEST
      });
    });

    it('calls Settings.set() with settings set to an empty object', () => {
      returnedFunction(dispatchMock);

      expect(Settings.set).toHaveBeenCalled();
      expect(Settings.set).toHaveBeenCalledWith({ settings: {} });
    });

    it('calls the loadSettings action to reload the settings', () => {
      returnedFunction(dispatchMock);
      expect(loadSettings).toHaveBeenCalledTimes(1);
    });

    it('dispatches an action of type RESET_SETTINGS_SUCCESS', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: RESET_SETTINGS_SUCCESS
      });
    });

    describe('when the function fails', () => {
      beforeEach(() => {
        // Make the function fail by throwing an error in Settings.set().
        Settings.set.mockImplementationOnce(() => {
          throw new Error('416782bb-53b3-49f8-a902-0fca3053ee3b');
        });
      });

      it('throws an error', () => {
        const dispatchAction = () => {
          resetSettings()(dispatchMock);
        };

        expect(dispatchAction).toThrowError('416782bb-53b3-49f8-a902-0fca3053ee3b');
      });

      it('dispatches an action of type RESET_SETTINGS_FAILURE with the error', () => {
        expect.hasAssertions();

        try {
          resetSettings()(dispatchMock);
        } catch (error) {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: RESET_SETTINGS_FAILURE,
            error
          });
        }
      });
    });
  });
});
