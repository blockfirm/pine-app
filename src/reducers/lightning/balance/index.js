import capacityReducer from './capacity';
import commitFeeReducer from './commitFee';
import localReducer from './local';
import remoteReducer from './remote';
import spendableReducer from './spendable';
import pendingReducer from './pending';
import unredeemedReducer from './unredeemed';

const lightningBalanceReducer = (state = {}, action, invoices) => ({
  capacity: capacityReducer(state.capacity, action),
  commitFee: commitFeeReducer(state.commitFee, action),
  local: localReducer(state.local, action),
  remote: remoteReducer(state.remote, action),
  spendable: spendableReducer(state.spendable, action),
  pending: pendingReducer(state.pending, action),
  unredeemed: unredeemedReducer(state.unredeemed, action, invoices)
});

export default lightningBalanceReducer;
