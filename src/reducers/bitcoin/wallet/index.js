import { combineReducers } from 'redux';
import addressesReducer from './addresses';

const walletReducer = combineReducers({
  addresses: addressesReducer
});

export default walletReducer;
