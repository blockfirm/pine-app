import { getClient } from '../../clients/lightning';

export const PINE_LIGHTNING_CREATE_INVOICE_REQUEST = 'PINE_LIGHTNING_CREATE_INVOICE_REQUEST';
export const PINE_LIGHTNING_CREATE_INVOICE_SUCCESS = 'PINE_LIGHTNING_CREATE_INVOICE_SUCCESS';
export const PINE_LIGHTNING_CREATE_INVOICE_FAILURE = 'PINE_LIGHTNING_CREATE_INVOICE_FAILURE';

const createInvoiceRequest = () => {
  return {
    type: PINE_LIGHTNING_CREATE_INVOICE_REQUEST
  };
};

const createInvoiceSuccess = (paymentRequest) => {
  return {
    type: PINE_LIGHTNING_CREATE_INVOICE_SUCCESS,
    paymentRequest
  };
};

const createInvoiceFailure = (error) => {
  return {
    type: PINE_LIGHTNING_CREATE_INVOICE_FAILURE,
    error
  };
};

/**
 * Action to create a new invoice on the user's lnd node.
 * Should only be used when redeeming gateway invoices.
 *
 * @param {string} satsAmount - Amount in satoshis the invoice should be for.
 */
export const createInvoice = (satsAmount) => {
  return (dispatch) => {
    const client = getClient();
    dispatch(createInvoiceRequest());

    return client.createInvoice(satsAmount)
      .then(({ paymentRequest }) => {
        dispatch(createInvoiceSuccess(paymentRequest));
        return paymentRequest;
      })
      .catch((error) => {
        dispatch(createInvoiceFailure(error));
        throw error;
      });
  };
};
