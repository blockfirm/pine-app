import { combineReducers } from 'redux';
import errorRreducer from './error';
import itemsReducer from './items';

const transactionsReducer = combineReducers({
  error: errorRreducer,
  items: itemsReducer
});

export default transactionsReducer;
