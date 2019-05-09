import {
  setHomeScreenIndex,
  NAVIGATE_SET_HOME_SCREEN_INDEX
} from '../../../../src/actions/navigate/setHomeScreenIndex';

describe('setHomeScreenIndex', () => {
  it('is a function', () => {
    expect(typeof setHomeScreenIndex).toBe('function');
  });

  it('accepts one argument', () => {
    expect(setHomeScreenIndex.length).toBe(1);
  });

  it('returns an object', () => {
    const returnValue = setHomeScreenIndex(1);

    expect(typeof returnValue).toBe('object');
    expect(returnValue).toBeTruthy();
  });

  describe('the returned object', () => {
    let index;
    let returnValue;

    beforeEach(() => {
      index = 1;
      returnValue = setHomeScreenIndex(index);
    });

    it('has "type" set to NAVIGATE_SET_HOME_SCREEN_INDEX', () => {
      expect(returnValue.type).toBe(NAVIGATE_SET_HOME_SCREEN_INDEX);
    });

    it('has "index" set to the passed index', () => {
      expect(returnValue.index).toBe(index);
    });
  });
});
