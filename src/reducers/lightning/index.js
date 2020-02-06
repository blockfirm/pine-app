import { combineReducers } from 'redux';
import lightningBalanceReducer from './balance';
import lightningInvoicesReducer from './invoices';

const lightningReducer = combineReducers({
  balance: lightningBalanceReducer,
  invoices: lightningInvoicesReducer
});

export default lightningReducer;
