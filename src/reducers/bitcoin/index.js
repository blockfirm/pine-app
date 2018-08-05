import { combineReducers } from 'redux';
import walletReducer from './wallet';

const bitcoinReducer = combineReducers({
  wallet: walletReducer
});

export default bitcoinReducer;
