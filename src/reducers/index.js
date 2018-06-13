import { combineReducers } from 'redux';
import errorReducer from './error';
import settingsReducer from './settings';
import keysReducer from './keys';
import recoveryKeyReducer from './recoveryKey';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    nav: navReducer,
    error: errorReducer,
    settings: settingsReducer,
    keys: keysReducer,
    recoveryKey: recoveryKeyReducer
  });

  return rootReducer;
};

export default getRootReducer;
