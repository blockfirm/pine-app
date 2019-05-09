import { NAVIGATE_SET_HOME_SCREEN_INDEX } from '../../../../src/actions/navigate/setHomeScreenIndex';
import homeScreenReducer from '../../../../src/reducers/navigate/homeScreen';

describe('homeScreenReducer', () => {
  it('is a function', () => {
    expect(typeof homeScreenReducer).toBe('function');
  });

  describe('when action is NAVIGATE_SET_HOME_SCREEN_INDEX', () => {
    it('returns an object with "index" set to action.index', () => {
      const oldState = {};

      const action = {
        type: NAVIGATE_SET_HOME_SCREEN_INDEX,
        index: 2
      };

      const newState = homeScreenReducer(oldState, action);

      expect(typeof newState).toBe('object');
      expect(newState.index).toBe(action.index);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { index: 4 };
      const action = { type: 'UNKNOWN' };
      const newState = homeScreenReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });
});
