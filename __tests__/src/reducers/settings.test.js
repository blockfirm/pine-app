import { LOAD_SETTINGS_SUCCESS } from '../../../src/actions/loadSettings';
import settingsReducer from '../../../src/reducers/settings';

describe('settingsReducer', () => {
  it('is a function', () => {
    expect(typeof settingsReducer).toBe('function');
  });

  describe('when action is LOAD_SETTINGS_SUCCESS', () => {
    it('returns the settings', () => {
      const oldState = {};
      const fakeSettings = { setting: '5e90e288-e9e9-47fc-87f2-9009c7889f17' };

      const action = {
        type: LOAD_SETTINGS_SUCCESS,
        settings: fakeSettings
      };

      const newState = settingsReducer(oldState, action);

      expect(typeof newState).toBe('object');
      expect(newState.setting).toBe(fakeSettings.setting);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { setting: '3a281b7e-2081-4e4a-aff9-eb9086d10905' };
      const action = { type: 'UNKNOWN' };
      const newState = settingsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });
});
