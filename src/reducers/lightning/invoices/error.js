import * as invoicesActions from '../../../actions/lightning/invoices';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case invoicesActions.LIGHTNING_INVOICES_LOAD_REQUEST:
    case invoicesActions.LIGHTNING_INVOICES_SAVE_REQUEST:
      return null;

    case invoicesActions.LIGHTNING_INVOICES_LOAD_FAILURE:
    case invoicesActions.LIGHTNING_INVOICES_SAVE_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default errorReducer;
