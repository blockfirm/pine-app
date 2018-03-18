import { combineReducers } from 'redux';
import errorReducer from './error';
import settingsReducer from './settings';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    nav: navReducer,
    error: errorReducer,
    settings: settingsReducer
  });

  return rootReducer;
};

export default getRootReducer;
