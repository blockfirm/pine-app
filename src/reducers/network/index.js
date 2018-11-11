import { combineReducers } from 'redux';
import internetReducer from './internet';
import serverReducer from './server';

const networkReducer = combineReducers({
  internet: internetReducer,
  server: serverReducer
});

export default networkReducer;
