const LIGHTNING_RPC_ACTION_PREFIX = 'PINE_LIGHTNING_RPC';

const syncErrorReducer = (state = {}, action) => {
  if (!action.type.startsWith(LIGHTNING_RPC_ACTION_PREFIX)) {
    return state;
  }

  const rpcMethod = action.type.replace(`${LIGHTNING_RPC_ACTION_PREFIX}_`, '');
  const currentCount = state[rpcMethod] || 0;

  return {
    ...state,
    [rpcMethod]: currentCount + 1
  };
};

export default syncErrorReducer;
