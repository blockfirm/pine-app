import { save } from './save';

export const BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS = 'BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS';

const removeAllSuccess = () => {
  return {
    type: BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS
  };
};

/**
 * Action to remove all utxos. Useful when resetting the app/wallet.
 */
export const removeAll = () => {
  return (dispatch) => {
    /**
     * The utxos are removed from the state by the reducer,
     * so this action must be dispatched before saving the state.
     */
    dispatch(removeAllSuccess());

    return dispatch(save());
  };
};
