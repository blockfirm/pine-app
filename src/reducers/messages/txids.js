import * as messageTxidsActions from '../../actions/messages/txids';

const txidsReducer = (state = {}, action) => {
  let newState;

  switch (action.type) {
    case messageTxidsActions.MESSAGES_TXIDS_LOAD_SUCCESS:
      return action.txids;

    case messageTxidsActions.MESSAGES_TXIDS_ADD:
      return {
        ...state,
        [action.txid]: true
      };

    case messageTxidsActions.MESSAGES_TXIDS_REMOVE:
      newState = { ...state };
      delete newState[action.txid];
      return newState;

    default:
      return state;
  }
};

export default txidsReducer;
