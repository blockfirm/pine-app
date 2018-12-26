import { combineReducers } from 'redux';
import fiatReducer from './fiat';
import walletReducer from './wallet';

const bitcoinReducer = combineReducers({
  fiat: fiatReducer,
  wallet: walletReducer
});

export default bitcoinReducer;
