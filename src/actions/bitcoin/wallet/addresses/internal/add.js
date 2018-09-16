import { save } from './save';

export const BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS = 'BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS';

export const addSuccess = (addresses) => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS,
    addresses
  };
};

/**
 * Action to add a set of internal bitcoin addresses to the state and persistent storage.
 *
 * @param {object} addresses - Set of addresses to add in the format { <address>: {} }.
 */
export const add = (addresses) => {
  return (dispatch) => {
    /**
     * The addresses are added to the state by the reducer,
     * so this action must be dispatched before saving the state.
     */
    dispatch(addSuccess(addresses));

    return dispatch(save()).then(() => addresses);
  };
};
