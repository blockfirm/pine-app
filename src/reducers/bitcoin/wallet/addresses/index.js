import { combineReducers } from 'redux';
import externalReducer from './external';
import internalReducer from './internal';

const addressesReducer = combineReducers({
  external: externalReducer,
  internal: internalReducer
});

export default addressesReducer;
