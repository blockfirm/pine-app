import { combineReducers } from 'redux';
import errorReducer from './error';
import itemsReducer from './items';

const invoicesReducer = combineReducers({
  error: errorReducer,
  items: itemsReducer
});

export default invoicesReducer;
