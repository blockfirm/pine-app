import { combineReducers } from 'redux';
import { RESET_SUCCESS } from '../actions';
import bitcoinReducer from './bitcoin';
import errorReducer from './error';
import settingsReducer from './settings';
import keysReducer from './keys';
import recoveryKeyReducer from './recoveryKey';
import networkReducer from './network';
import notificationsReducer from './notifications';
import contactsReducer from './contacts';
import messagesReducer from './messages';
import syncingReducer from './syncing';
import pineReducer from './pine';
import readyReducer from './ready';
import navigateReducer from './navigate';

const getRootReducer = (navReducer) => {
  const rootReducer = combineReducers({
    bitcoin: bitcoinReducer,
    nav: navReducer,
    error: errorReducer,
    settings: settingsReducer,
    keys: keysReducer,
    recoveryKey: recoveryKeyReducer,
    network: networkReducer,
    notifications: notificationsReducer,
    contacts: contactsReducer,
    messages: messagesReducer,
    syncing: syncingReducer,
    pine: pineReducer,
    ready: readyReducer,
    navigate: navigateReducer
  });

  return (state, action) => {
    if (action.type === RESET_SUCCESS) {
      // Reset app but keep navigation and settings state.
      const { nav, settings } = state;
      state = { nav, settings }; // eslint-disable-line no-param-reassign
    }

    return rootReducer(state, action);
  };
};

export default getRootReducer;
