import { save } from './save';

export const BITCOIN_WALLET_ADDRESSES_EXTERNAL_REMOVE_ALL_SUCCESS = 'BITCOIN_WALLET_ADDRESSES_EXTERNAL_REMOVE_ALL_SUCCESS';

const removeAllSuccess = () => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_EXTERNAL_REMOVE_ALL_SUCCESS
  };
};

/**
 * Action to remove all external addresses. Useful when resetting the app/wallet.
 */
export const removeAll = () => {
  return (dispatch) => {
    /**
     * The addresses are removed from the state by the reducer,
     * so this action must be dispatched before saving the state.
     */
    dispatch(removeAllSuccess());

    return dispatch(save());
  };
};
