import { NAVIGATE_SET_HOME_SCREEN_INDEX } from '../../actions/navigate/setHomeScreenIndex';

const homeScreen = (state = {}, action) => {
  switch (action.type) {
    case NAVIGATE_SET_HOME_SCREEN_INDEX:
      return {
        ...state,
        index: action.index
      };

    default:
      return state;
  }
};

export default homeScreen;
