import { save } from './save';

export const LIGHTNING_INVOICES_ADD_SUCCESS = 'LIGHTNING_INVOICES_ADD_SUCCESS';

export const addSuccess = (invoices) => {
  return {
    type: LIGHTNING_INVOICES_ADD_SUCCESS,
    invoices
  };
};

/**
 * Action to add a list of lightning invoices to the state and persistent storage.
 *
 * @param {Object[]} invoices - List of invoices to add.
 */
export const add = (invoices) => {
  return (dispatch) => {
    /**
     * The invoices are added to the state by the reducer, so
     * this action must be dispatched before saving the state.
     */
    dispatch(addSuccess(invoices));

    return dispatch(save()).then(() => invoices);
  };
};
