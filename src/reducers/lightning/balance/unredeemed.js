import * as invoicesActions from '../../../actions/lightning/invoices';

const getSumOfUnredeemed = (invoices) => {
  return invoices.reduce((sum, invoice) => {
    if (!invoice.redeem || invoice.redeemed) {
      return sum;
    }

    return sum + parseInt(invoice.paidAmount);
  }, 0);
};

const unredeemedReducer = (state = 0, action, invoices) => {
  switch (action.type) {
    case invoicesActions.LIGHTNING_INVOICES_LOAD_SUCCESS:
    case invoicesActions.LIGHTNING_INVOICES_ADD_SUCCESS:
    case invoicesActions.LIGHTNING_INVOICES_UPDATE_SUCCESS:
    case invoicesActions.LIGHTNING_INVOICES_REDEEM_SUCCESS:
    case invoicesActions.LIGHTNING_INVOICES_REDEEM_FAILURE:
      return getSumOfUnredeemed(invoices);

    default:
      return state;
  }
};

export default unredeemedReducer;
