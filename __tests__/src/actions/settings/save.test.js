import { Settings } from 'react-native';
import { load as loadSettings } from '../../../../src/actions/settings/load';
import {
  save as saveSettings,
  SETTINGS_SAVE_REQUEST,
  SETTINGS_SAVE_SUCCESS,
  SETTINGS_SAVE_FAILURE
} from '../../../../src/actions/settings/save';

const dispatchMock = jest.fn();

jest.mock('../../../../src/actions/settings/load', () => ({
  load: jest.fn()
}));

describe('SETTINGS_SAVE_REQUEST', () => {
  it('equals "SETTINGS_SAVE_REQUEST"', () => {
    expect(SETTINGS_SAVE_REQUEST).toBe('SETTINGS_SAVE_REQUEST');
  });
});

describe('SETTINGS_SAVE_SUCCESS', () => {
  it('equals "SETTINGS_SAVE_SUCCESS"', () => {
    expect(SETTINGS_SAVE_SUCCESS).toBe('SETTINGS_SAVE_SUCCESS');
  });
});

describe('SETTINGS_SAVE_FAILURE', () => {
  it('equals "SETTINGS_SAVE_FAILURE"', () => {
    expect(SETTINGS_SAVE_FAILURE).toBe('SETTINGS_SAVE_FAILURE');
  });
});

describe('save', () => {
  let fakeSettings;

  beforeEach(() => {
    fakeSettings = {
      bitcoin: {
        unit: '34c451fe-83dd-4d69-b492-606b46f4e823'
      }
    };

    Settings.get.mockClear();
    Settings.set.mockClear();
    loadSettings.mockClear();
  });

  it('is a function', () => {
    expect(typeof saveSettings).toBe('function');
  });

  it('accepts one argument', () => {
    expect(saveSettings.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = saveSettings(fakeSettings);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = saveSettings(fakeSettings);
    });

    it('dispatches an action of type SETTINGS_SAVE_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SETTINGS_SAVE_REQUEST
      });
    });

    it('calls the loadSettings action to reload the settings', () => {
      returnedFunction(dispatchMock);
      expect(loadSettings).toHaveBeenCalledTimes(1);
    });

    it('dispatches an action of type SETTINGS_SAVE_SUCCESS', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: SETTINGS_SAVE_SUCCESS
      });
    });

    describe('when there are old settings', () => {
      beforeEach(() => {
        Settings.get.mockImplementationOnce(() => ({
          bitcoin: {
            unit: 'ba43079e-5f48-4d0a-8243-1f1fa60b32b5'
          },
          api: {
            baseUrl: 'd23e66d7-d18a-4ed6-ae54-8a4d178a8574'
          }
        }));
      });

      it('calls Settings.set() with a merge of the old and new settings', () => {
        const expectedSettings = {
          bitcoin: {
            // The unit should be overridden by fakeSettings.
            unit: '34c451fe-83dd-4d69-b492-606b46f4e823'
          },
          api: {
            baseUrl: 'd23e66d7-d18a-4ed6-ae54-8a4d178a8574'
          }
        };

        returnedFunction(dispatchMock);

        expect(Settings.set).toHaveBeenCalled();
        expect(Settings.set).toHaveBeenCalledWith({ settings: expectedSettings });
      });
    });

    describe('when there are no old settings', () => {
      beforeEach(() => {
        // Return undefined from Settings.get().
        Settings.get.mockImplementationOnce(() => undefined);
      });

      it('saves only the new settings', () => {
        returnedFunction(dispatchMock);

        expect(Settings.set).toHaveBeenCalled();
        expect(Settings.set.mock.calls[0][0]).toMatchObject({ settings: fakeSettings });
      });
    });

    describe('when the function fails', () => {
      beforeEach(() => {
        // Make the function fail by throwing an error in Settings.set().
        Settings.set.mockImplementationOnce(() => {
          throw new Error('18eafc71-7a92-4b8a-854a-ca2c528747d4');
        });
      });

      it('throws an error', () => {
        const dispatchAction = () => {
          saveSettings(fakeSettings)(dispatchMock);
        };

        expect(dispatchAction).toThrowError('18eafc71-7a92-4b8a-854a-ca2c528747d4');
      });

      it('dispatches an action of type SETTINGS_SAVE_FAILURE with the error', () => {
        expect.hasAssertions();

        try {
          saveSettings(fakeSettings)(dispatchMock);
        } catch (error) {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: SETTINGS_SAVE_FAILURE,
            error
          });
        }
      });
    });
  });
});
