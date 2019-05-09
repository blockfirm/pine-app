export const NAVIGATE_SET_HOME_SCREEN_INDEX = 'NAVIGATE_SET_HOME_SCREEN_INDEX';

/**
 * Action to make the home screen slide to the specified index.
 */
export const setHomeScreenIndex = (index) => {
  return {
    type: NAVIGATE_SET_HOME_SCREEN_INDEX,
    index
  };
};
