import { removeAll as removeAllExternalAddresses } from './addresses/external';
import { removeAll as removeAllInternalAddresses } from './addresses/internal';
import { removeAll as removeAllTransactions } from './transactions';
import { removeAll as removeAllUtxos } from './utxos';

export const BITCOIN_WALLET_RESET_REQUEST = 'BITCOIN_WALLET_RESET_REQUEST';
export const BITCOIN_WALLET_RESET_SUCCESS = 'BITCOIN_WALLET_RESET_SUCCESS';
export const BITCOIN_WALLET_RESET_FAILURE = 'BITCOIN_WALLET_RESET_FAILURE';

const resetRequest = () => {
  return {
    type: BITCOIN_WALLET_RESET_REQUEST
  };
};

const resetSuccess = () => {
  return {
    type: BITCOIN_WALLET_RESET_SUCCESS
  };
};

const resetFailure = (error) => {
  return {
    type: BITCOIN_WALLET_RESET_FAILURE,
    error
  };
};

/**
 * Action to reset the bitcoin wallet by removing all its addresses,
 * transactions, and utxos.
 */
export const reset = () => {
  return (dispatch) => {
    dispatch(resetRequest());

    const promises = [
      dispatch(removeAllExternalAddresses()),
      dispatch(removeAllInternalAddresses()),
      dispatch(removeAllTransactions()),
      dispatch(removeAllUtxos())
    ];

    return Promise.all(promises)
      .then(() => {
        dispatch(resetSuccess());
      })
      .catch((error) => {
        dispatch(resetFailure(error));
        throw error;
      });
  };
};
