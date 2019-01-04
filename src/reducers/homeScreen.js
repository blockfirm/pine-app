import { SET_HOME_SCREEN_INDEX } from '../actions/setHomeScreenIndex';
import { DISABLE_SCROLL } from '../actions/disableScroll';

const homeScreen = (state = {}, action) => {
  switch (action.type) {
    case SET_HOME_SCREEN_INDEX:
      return {
        ...state,
        index: action.index
      };

    case DISABLE_SCROLL:
      return {
        ...state,
        scrollDisabled: action.disable
      };

    default:
      return state;
  }
};

export default homeScreen;
