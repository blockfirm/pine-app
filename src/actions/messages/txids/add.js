import { save } from './save';

export const MESSAGES_TXIDS_ADD = 'MESSAGES_TXIDS_ADD';

/**
 * Action to add a txid to the list of message transactions.
 *
 * This is used as an index when syncing wallet to check
 * whether a transaction came from a Pine message, and if
 * it didn't, a new conversation will be created.
 *
 * @param {string} txid - Transaction ID (txid) to add.
 */
export const add = (txid) => {
  return (dispatch) => {
    /**
     * The txid is added to the state by the reducer, so this
     * action must be dispatched before saving the state.
     */
    dispatch({
      type: MESSAGES_TXIDS_ADD,
      txid
    });

    return dispatch(save());
  };
};
