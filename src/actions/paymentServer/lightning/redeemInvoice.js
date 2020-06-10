import redeemInvoiceFromServer from '../../../clients/paymentServer/user/lightning/invoices/redeem';

export const PINE_LIGHTNING_REDEEM_INVOICE_REQUEST = 'PINE_LIGHTNING_REDEEM_INVOICE_REQUEST';
export const PINE_LIGHTNING_REDEEM_INVOICE_SUCCESS = 'PINE_LIGHTNING_REDEEM_INVOICE_SUCCESS';
export const PINE_LIGHTNING_REDEEM_INVOICE_FAILURE = 'PINE_LIGHTNING_REDEEM_INVOICE_FAILURE';

const redeemInvoiceRequest = () => {
  return {
    type: PINE_LIGHTNING_REDEEM_INVOICE_REQUEST
  };
};

const redeemInvoiceSuccess = () => {
  return {
    type: PINE_LIGHTNING_REDEEM_INVOICE_SUCCESS
  };
};

const redeemInvoiceFailure = (error) => {
  return {
    type: PINE_LIGHTNING_REDEEM_INVOICE_FAILURE,
    error
  };
};

/**
 * Action to redeem an invoice from the Pine server.
 *
 * @param {string} invoiceId - ID of invoice to redeem.
 * @param {string} paymentRequest - Lightning payment request to redeem to.
 */
export const redeemInvoice = (invoiceId, paymentRequest) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(redeemInvoiceRequest());

    try {
      await redeemInvoiceFromServer(invoiceId, paymentRequest, credentials);
    } catch (error) {
      dispatch(redeemInvoiceFailure(error));
      throw error;
    }

    dispatch(redeemInvoiceSuccess());
  };
};
