import { getInvoice } from '../../paymentServer/lightning';
import { save } from './save';

export const LIGHTNING_INVOICES_UPDATE_REQUEST = 'LIGHTNING_INVOICES_UPDATE_REQUEST';
export const LIGHTNING_INVOICES_UPDATE_SUCCESS = 'LIGHTNING_INVOICES_UPDATE_SUCCESS';
export const LIGHTNING_INVOICES_UPDATE_FAILURE = 'LIGHTNING_INVOICES_UPDATE_FAILURE';

const updateRequest = () => {
  return {
    type: LIGHTNING_INVOICES_UPDATE_REQUEST
  };
};

const updateSuccess = (invoice) => {
  return {
    type: LIGHTNING_INVOICES_UPDATE_SUCCESS,
    invoice
  };
};

const updateFailure = (invoice, error) => {
  return {
    type: LIGHTNING_INVOICES_UPDATE_FAILURE,
    invoice,
    error
  };
};

/**
 * Action to update an outgoing invoice.
 *
 * @param {Object} invoice - Invoice to update.
 * @param {string} invoice.id - ID of the invoice.
 * @param {string} invoice.payee - Pine address that the invoice pays to.
 */
export const update = (invoice) => {
  return async (dispatch, getState) => {
    const contacts = Object.values(getState().contacts.items);
    const contact = contacts.find(c => c.address === invoice.payee);

    if (!contact) {
      return;
    }

    dispatch(updateRequest());

    try {
      const updatedInvoice = await dispatch(getInvoice(invoice.id, contact));
      dispatch(updateSuccess(updatedInvoice));
      await dispatch(save());
    } catch (error) {
      dispatch(updateFailure(invoice, error));
      throw error;
    }
  };
};
