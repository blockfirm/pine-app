import { combineReducers } from 'redux';
import addressesReducer from './addresses';
import transactionsReducer from './transactions';
import utxosReducer from './utxos';

const walletReducer = combineReducers({
  addresses: addressesReducer,
  transactions: transactionsReducer,
  utxos: utxosReducer
});

export default walletReducer;
