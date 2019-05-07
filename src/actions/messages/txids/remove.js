import { save } from './save';

export const MESSAGES_TXIDS_REMOVE = 'MESSAGES_TXIDS_REMOVE';

/**
 * Action to remove a txid to the list of message transactions.
 *
 * @param {string} txid - Transaction ID (txid) to remove.
 */
export const remove = (txid) => {
  return (dispatch) => {
    /**
     * The txid is removed to the state by the reducer, so this
     * action must be dispatched before saving the state.
     */
    dispatch({
      type: MESSAGES_TXIDS_REMOVE,
      txid
    });

    return dispatch(save());
  };
};
