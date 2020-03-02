import lightningBalanceReducer from './balance';
import lightningInvoicesReducer from './invoices';

const lightningReducer = (state = {}, action) => {
  const invoices = lightningInvoicesReducer(state.invoices, action);
  const balance = lightningBalanceReducer(state.balance, action, invoices.items);

  return { balance, invoices };
};

export default lightningReducer;
