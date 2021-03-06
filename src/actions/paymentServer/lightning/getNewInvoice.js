import getNewInvoiceFromServer from '../../../clients/paymentServer/user/lightning/invoices/create';

export const PINE_LIGHTNING_GET_NEW_INVOICE_REQUEST = 'PINE_LIGHTNING_GET_NEW_INVOICE_REQUEST';
export const PINE_LIGHTNING_GET_NEW_INVOICE_SUCCESS = 'PINE_LIGHTNING_GET_NEW_INVOICE_SUCCESS';
export const PINE_LIGHTNING_GET_NEW_INVOICE_FAILURE = 'PINE_LIGHTNING_GET_NEW_INVOICE_FAILURE';

const getNewInvoiceRequest = () => {
  return {
    type: PINE_LIGHTNING_GET_NEW_INVOICE_REQUEST
  };
};

const getNewInvoiceSuccess = (invoice) => {
  return {
    type: PINE_LIGHTNING_GET_NEW_INVOICE_SUCCESS,
    invoice
  };
};

const getNewInvoiceFailure = (error) => {
  return {
    type: PINE_LIGHTNING_GET_NEW_INVOICE_FAILURE,
    error
  };
};

/**
 * Action to get a new lightning invoice for a Pine contact.
 *
 * Note: This gets an invoice to the contact's gateway node and not to the
 * contact's own lightning node. Once paid, it will be redeemed by the contact.
 *
 * @param {number} amountSats - Amount in satoshis the invoice should be for.
 * @param {Object} message - Payment message to send to contact when invoice has been paid.
 * @param {number} message.version - Always 1.
 * @param {string} message.type - `'lightning_payment'`.
 * @param {Object} message.data - Additional data attached to the message.
 * @param {Object} contact - Contact to get invoice for.
 * @param {string} contact.address - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key.
 */
export const getNewInvoice = (amountSats, message, contact) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(getNewInvoiceRequest());

    return getNewInvoiceFromServer(amountSats, message, contact, credentials)
      .then((invoice) => {
        dispatch(getNewInvoiceSuccess(invoice));
        return invoice;
      })
      .catch((error) => {
        dispatch(getNewInvoiceFailure(error));
        throw error;
      });
  };
};
