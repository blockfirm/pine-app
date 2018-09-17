import { combineReducers } from 'redux';
import addressesReducer from './addresses';
import transactionsReducer from './transactions';
import utxosReducer from './utxos';
import balanceReducer from './balance';

const walletReducer = combineReducers({
  addresses: addressesReducer,
  transactions: transactionsReducer,
  utxos: utxosReducer,
  balance: balanceReducer
});

export default walletReducer;
