import { combineReducers } from 'redux';
import internetReducer from './internet';
import serverReducer from './server';
import pineReducer from './pine';

const networkReducer = combineReducers({
  internet: internetReducer,
  server: serverReducer,
  pine: pineReducer
});

export default networkReducer;
