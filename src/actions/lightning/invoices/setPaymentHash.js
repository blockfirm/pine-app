import { save } from './save';

export const LIGHTNING_INVOICES_SET_PAYMENT_HASH = 'LIGHTNING_INVOICES_SET_PAYMENT_HASH';

/**
 * Action to set a payment hash on a paid lightning invoice.
 *
 * @param {Object} invoice - Invoice to set the payment hash on.
 * @param {string} invoice.id - ID of the invoice.
 * @param {string} paymentHash - Lightning payment hash for the invoice.
 */
export const setPaymentHash = (invoice, paymentHash) => {
  return (dispatch) => {
    dispatch({
      type: LIGHTNING_INVOICES_SET_PAYMENT_HASH,
      invoice,
      paymentHash
    });

    return dispatch(save());
  };
};
