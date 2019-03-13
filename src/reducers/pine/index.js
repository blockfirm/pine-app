import { combineReducers } from 'redux';
import credentialsReducer from './credentials';

const pineReducer = combineReducers({
  credentials: credentialsReducer
});

export default pineReducer;
