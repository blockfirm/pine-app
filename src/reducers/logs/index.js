import { combineReducers } from 'redux';
import entriesReducer from './entries';

const logsReducer = combineReducers({
  entries: entriesReducer
});

export default logsReducer;
