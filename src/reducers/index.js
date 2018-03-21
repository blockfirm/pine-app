import { combineReducers } from 'redux';
import errorReducer from './error';
import settingsReducer from './settings';
import keysReducer from './keys';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    nav: navReducer,
    error: errorReducer,
    settings: settingsReducer,
    keys: keysReducer
  });

  return rootReducer;
};

export default getRootReducer;
