import { combineReducers } from 'redux';
import bitcoinReducer from './bitcoin';
import errorReducer from './error';
import settingsReducer from './settings';
import keysReducer from './keys';
import recoveryKeyReducer from './recoveryKey';
import networkReducer from './network';
import homeScreenReducer from './homeScreen';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    bitcoin: bitcoinReducer,
    nav: navReducer,
    error: errorReducer,
    settings: settingsReducer,
    keys: keysReducer,
    recoveryKey: recoveryKeyReducer,
    network: networkReducer,
    homeScreen: homeScreenReducer
  });

  return rootReducer;
};

export default getRootReducer;
