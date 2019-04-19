import { combineReducers } from 'redux';
import error from './error';
import items from './items';

const utxosReducer = combineReducers({
  error,
  items
});

export default utxosReducer;
