import * as invoicesActions from '../../../actions/lightning/invoices';

const createMessageIdMap = (items) => {
  return items.reduce((map, item) => {
    if (item.messageId) {
      map[item.messageId] = item;
    }

    return map;
  }, {});
};

const itemsByMessageIdReducer = (state = {}, action) => {
  switch (action.type) {
    case invoicesActions.LIGHTNING_INVOICES_LOAD_SUCCESS:
      return createMessageIdMap(action.invoices);

    case invoicesActions.LIGHTNING_INVOICES_ADD_SUCCESS:
      if (!action.invoices.length) {
        return state;
      }

      return {
        ...state,
        ...createMessageIdMap(action.invoices)
      };

    case invoicesActions.LIGHTNING_INVOICES_REDEEM_SUCCESS:
      if (!action.invoice.messageId) {
        return state;
      }

      return {
        ...state,
        [action.invoice.messageId]: {
          ...state[action.invoice.messageId],
          redeemed: true
        }
      };

    case invoicesActions.LIGHTNING_INVOICES_REDEEM_FAILURE:
      if (!action.invoice.messageId) {
        return state;
      }

      return {
        ...state,
        [action.invoice.messageId]: {
          ...state[action.invoice.messageId],
          redeemError: action.error.message
        }
      };

    case invoicesActions.LIGHTNING_INVOICES_SET_PAYMENT_HASH:
      if (!action.invoice.messageId) {
        return state;
      }

      return {
        ...state,
        [action.invoice.messageId]: {
          ...state[action.invoice.messageId],
          paymentHash: action.paymentHash
        }
      };

    default:
      return state;
  }
};

export default itemsByMessageIdReducer;
