import { save } from './save';

export const CONTACTS_REMOVE_ALL_SUCCESS = 'CONTACTS_REMOVE_ALL_SUCCESS';

const removeAllSuccess = () => {
  return {
    type: CONTACTS_REMOVE_ALL_SUCCESS
  };
};

/**
 * Action to remove all contacts.
 */
export const removeAll = () => {
  return (dispatch) => {
    /**
     * The contacts are removed from the state by the reducer,
     * so this action must be dispatched before saving the state.
     */
    dispatch(removeAllSuccess());
    return dispatch(save());
  };
};
