import lightningBalanceReducer from './balance';
import lightningInvoicesReducer from './invoices';
import lightningSyncErrorReducer from './syncError';

const lightningReducer = (state = {}, action) => {
  const invoices = lightningInvoicesReducer(state.invoices, action);
  const balance = lightningBalanceReducer(state.balance, action, invoices.items);
  const syncError = lightningSyncErrorReducer(state.syncError, action);

  return { balance, invoices, syncError };
};

export default lightningReducer;
