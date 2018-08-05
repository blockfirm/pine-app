import { combineReducers } from 'redux';
import addressesReducer from './addresses';
import transactionsReducer from './transactions';

const walletReducer = combineReducers({
  addresses: addressesReducer,
  transactions: transactionsReducer
});

export default walletReducer;
