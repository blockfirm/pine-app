import * as invoicesActions from '../../../actions/lightning/invoices';

/**
 * Merges two lists of invoices based on their IDs.
 *
 * @param {Object[]} oldInvoices - List of old invoices.
 * @param {Object[]} newInvoices - List of new invoices to add or update.
 *
 * @returns {Object[]} A new merged list of invoices.
 */
const mergeInvoices = (oldInvoices, newInvoices) => {
  const oldIdMap = oldInvoices.reduce((map, oldInvoice) => {
    map[oldInvoice.id] = oldInvoice;
    return map;
  }, {});

  const newIdMap = newInvoices.reduce((map, newInvoice) => {
    map[newInvoice.id] = newInvoice;
    return map;
  }, {});

  // Update existing invoices.
  const updatedInvoices = oldInvoices.map((oldInvoice) => {
    if (newIdMap[oldInvoice.id]) {
      return { ...oldInvoice, ...newIdMap[oldInvoice.id] };
    }

    return oldInvoice;
  });

  // Add new invoices.
  newInvoices.forEach((newInvoice) => {
    if (!oldIdMap[newInvoice.id]) {
      updatedInvoices.push(newInvoice);
    }
  });

  return updatedInvoices;
};

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case invoicesActions.LIGHTNING_INVOICES_LOAD_SUCCESS:
      return action.invoices;

    case invoicesActions.LIGHTNING_INVOICES_ADD_SUCCESS:
      if (!action.invoices.length) {
        return state;
      }

      return mergeInvoices(state, action.invoices);

    default:
      return state;
  }
};

export default itemsReducer;
