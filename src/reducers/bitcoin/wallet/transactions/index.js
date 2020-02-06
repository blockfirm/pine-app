import { combineReducers } from 'redux';
import errorReducer from './error';
import itemsReducer from './items';

const transactionsReducer = combineReducers({
  error: errorReducer,
  items: itemsReducer
});

export default transactionsReducer;
