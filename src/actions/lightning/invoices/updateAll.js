import { update } from './update';

export const LIGHTNING_INVOICES_UPDATE_ALL_REQUEST = 'LIGHTNING_INVOICES_UPDATE_ALL_REQUEST';
export const LIGHTNING_INVOICES_UPDATE_ALL_SUCCESS = 'LIGHTNING_INVOICES_UPDATE_ALL_SUCCESS';
export const LIGHTNING_INVOICES_UPDATE_ALL_FAILURE = 'LIGHTNING_INVOICES_UPDATE_ALL_FAILURE';

const updateAllRequest = () => {
  return {
    type: LIGHTNING_INVOICES_UPDATE_ALL_REQUEST
  };
};

const updateAllSuccess = () => {
  return {
    type: LIGHTNING_INVOICES_UPDATE_ALL_SUCCESS
  };
};

const updateAllFailure = (error) => {
  return {
    type: LIGHTNING_INVOICES_UPDATE_ALL_FAILURE,
    error
  };
};

/**
 * Action to update all outgoing invoices (for sent payments).
 */
export const updateAll = () => {
  return async (dispatch, getState) => {
    const invoices = getState().lightning.invoices.items;

    dispatch(updateAllRequest());

    const promises = invoices.map((invoice) => {
      if (!invoice.redeemed && invoice.payee) {
        return dispatch(update(invoice));
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      dispatch(updateAllFailure(error));
      throw error;
    }

    dispatch(updateAllSuccess());
  };
};
