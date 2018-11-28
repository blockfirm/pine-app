import { SET_HOME_SCREEN_INDEX } from '../actions/setHomeScreenIndex';

const homeScreen = (state = {}, action) => {
  switch (action.type) {
    case SET_HOME_SCREEN_INDEX:
      return {
        ...state,
        index: action.index
      };

    default:
      return state;
  }
};

export default homeScreen;
