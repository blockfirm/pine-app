export const SET_HOME_SCREEN_INDEX = 'SET_HOME_SCREEN_INDEX';

/**
 * Action to make the home screen slide to the specified index.
 */
export const setHomeScreenIndex = (index) => {
  return {
    type: SET_HOME_SCREEN_INDEX,
    index
  };
};
