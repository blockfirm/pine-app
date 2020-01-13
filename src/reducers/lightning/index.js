import { combineReducers } from 'redux';
import lightningBalanceReducer from './balance';

const lightningReducer = combineReducers({
  balance: lightningBalanceReducer
});

export default lightningReducer;
