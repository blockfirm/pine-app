import { save } from './save';

export const MESSAGES_TXIDS_REMOVE_ALL = 'MESSAGES_TXIDS_REMOVE_ALL';

/**
 * Action to remove all txids from the list of message transactions.
 * Useful when resetting the app/wallet.
 */
export const removeAll = () => {
  return (dispatch) => {
    /**
     * The txids are removed from the state by the reducer,
     * so this action must be dispatched before saving the state.
     */
    dispatch({
      type: MESSAGES_TXIDS_REMOVE_ALL
    });

    return dispatch(save());
  };
};
