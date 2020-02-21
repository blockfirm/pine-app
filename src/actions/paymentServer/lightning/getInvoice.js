import getInvoiceFromServer from '../../../clients/paymentServer/user/lightning/invoices/get';

export const PINE_LIGHTNING_GET_INVOICE_REQUEST = 'PINE_LIGHTNING_GET_INVOICE_REQUEST';
export const PINE_LIGHTNING_GET_INVOICE_SUCCESS = 'PINE_LIGHTNING_GET_INVOICE_SUCCESS';
export const PINE_LIGHTNING_GET_INVOICE_FAILURE = 'PINE_LIGHTNING_GET_INVOICE_FAILURE';

const getInvoiceRequest = () => {
  return {
    type: PINE_LIGHTNING_GET_INVOICE_REQUEST
  };
};

const getInvoiceSuccess = (invoice) => {
  return {
    type: PINE_LIGHTNING_GET_INVOICE_SUCCESS,
    invoice
  };
};

const getInvoiceFailure = (error) => {
  return {
    type: PINE_LIGHTNING_GET_INVOICE_FAILURE,
    error
  };
};

/**
 * Action to get an existing lightning invoice from a contact.
 *
 * @param {string} invoiceId - ID of invoice to get.
 * @param {Object} contact - Contact to get invoice for.
 * @param {string} contact.address - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key.
 */
export const getInvoice = (invoiceId, contact) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(getInvoiceRequest());

    return getInvoiceFromServer({
      id: invoiceId,
      payee: contact.address,
      userId: contact.userId
    }, credentials)
      .then((invoice) => {
        dispatch(getInvoiceSuccess(invoice));
        return invoice;
      })
      .catch((error) => {
        dispatch(getInvoiceFailure(error));
        throw error;
      });
  };
};
