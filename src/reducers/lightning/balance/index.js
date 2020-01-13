import { combineReducers } from 'redux';
import capacityReducer from './capacity';
import commitFeeReducer from './commitFee';
import localReducer from './local';
import remoteReducer from './remote';
import pendingReducer from './pending';

const lightningBalanceReducer = combineReducers({
  capacity: capacityReducer,
  commitFee: commitFeeReducer,
  local: localReducer,
  remote: remoteReducer,
  pending: pendingReducer
});

export default lightningBalanceReducer;
