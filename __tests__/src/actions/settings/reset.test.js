import { Settings } from 'react-native';
import { load as loadSettings } from '../../../../src/actions/settings/load';
import {
  reset as resetSettings,
  SETTINGS_RESET_REQUEST,
  SETTINGS_RESET_SUCCESS,
  SETTINGS_RESET_FAILURE
} from '../../../../src/actions/settings/reset';

const dispatchMock = jest.fn();

jest.mock('../../../../src/actions/settings/load', () => ({
  load: jest.fn()
}));

describe('SETTINGS_RESET_REQUEST', () => {
  it('equals "SETTINGS_RESET_REQUEST"', () => {
    expect(SETTINGS_RESET_REQUEST).toBe('SETTINGS_RESET_REQUEST');
  });
});

describe('SETTINGS_RESET_SUCCESS', () => {
  it('equals "SETTINGS_RESET_SUCCESS"', () => {
    expect(SETTINGS_RESET_SUCCESS).toBe('SETTINGS_RESET_SUCCESS');
  });
});

describe('SETTINGS_RESET_FAILURE', () => {
  it('equals "SETTINGS_RESET_FAILURE"', () => {
    expect(SETTINGS_RESET_FAILURE).toBe('SETTINGS_RESET_FAILURE');
  });
});

describe('reset', () => {
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

    it('dispatches an action of type SETTINGS_RESET_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SETTINGS_RESET_REQUEST
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

    it('dispatches an action of type SETTINGS_RESET_SUCCESS', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SETTINGS_RESET_SUCCESS
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

      it('dispatches an action of type SETTINGS_RESET_FAILURE with the error', () => {
        expect.hasAssertions();

        try {
          resetSettings()(dispatchMock);
        } catch (error) {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: SETTINGS_RESET_FAILURE,
            error
          });
        }
      });
    });
  });
});
