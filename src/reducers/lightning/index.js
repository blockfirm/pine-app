import lightningBalanceReducer from './balance';
import lightningInvoicesReducer from './invoices';
import lightningMetricsReducer from './metrics';
import lightningSyncErrorReducer from './syncError';

const lightningReducer = (state = {}, action) => {
  const invoices = lightningInvoicesReducer(state.invoices, action);
  const balance = lightningBalanceReducer(state.balance, action, invoices.items);
  const metrics = lightningMetricsReducer(state.metrics, action);
  const syncError = lightningSyncErrorReducer(state.syncError, action);

  return {
    balance,
    invoices,
    metrics,
    syncError
  };
};

export default lightningReducer;
