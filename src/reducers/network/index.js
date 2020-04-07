import { combineReducers } from 'redux';
import internetReducer from './internet';
import serverReducer from './server';
import pineReducer from './pine';
import lightningReducer from './lightning';

const networkReducer = combineReducers({
  internet: internetReducer,
  server: serverReducer,
  pine: pineReducer,
  lightning: lightningReducer
});

export default networkReducer;
