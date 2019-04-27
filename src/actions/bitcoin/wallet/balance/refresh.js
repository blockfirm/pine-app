export const BITCOIN_WALLET_BALANCE_REFRESH = 'BITCOIN_WALLET_BALANCE_REFRESH';

/**
 * Action to refresh the wallet balance.
 */
export const refresh = () => {
  return (dispatch, getState) => {
    const utxos = getState().bitcoin.wallet.utxos.items || [];

    return dispatch({
      type: BITCOIN_WALLET_BALANCE_REFRESH,
      utxos
    });
  };
};
