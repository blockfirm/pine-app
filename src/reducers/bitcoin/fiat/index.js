import { combineReducers } from 'redux';
import ratesReducer from './rates';

const fiatReducer = combineReducers({
  rates: ratesReducer
});

export default fiatReducer;
