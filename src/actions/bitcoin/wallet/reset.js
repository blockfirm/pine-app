import { removeAll as removeAllExternalAddresses } from './addresses/external';
import { removeAll as removeAllInternalAddresses } from './addresses/internal';
import { removeAll as removeAllTransactions } from './transactions';

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
 * Action to reset the bitcoin wallet by removing all
 * its addresses and transactions.
 */
export const reset = () => {
  return (dispatch) => {
    dispatch(resetRequest());

    const promises = [
      dispatch(removeAllExternalAddresses()),
      dispatch(removeAllInternalAddresses()),
      dispatch(removeAllTransactions())
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
