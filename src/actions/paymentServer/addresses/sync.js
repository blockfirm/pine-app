import { flagAsUsed } from './flagAsUsed';
import { setIndex } from './setIndex';

export const PINE_ADDRESSES_SYNC_REQUEST = 'PINE_ADDRESSES_SYNC_REQUEST';
export const PINE_ADDRESSES_SYNC_SUCCESS = 'PINE_ADDRESSES_SYNC_SUCCESS';
export const PINE_ADDRESSES_SYNC_FAILURE = 'PINE_ADDRESSES_SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: PINE_ADDRESSES_SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: PINE_ADDRESSES_SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: PINE_ADDRESSES_SYNC_FAILURE,
    error
  };
};

const flagAddressesAsUsed = (dispatch, transactions) => {
  const usedAddresses = transactions.reduce((list, transaction) => {
    transaction.vout.forEach((vout) => {
      vout.scriptPubKey.addresses.forEach((address) => list.push(address));
    });

    return list;
  }, []);

  if (usedAddresses.length === 0) {
    return Promise.resolve();
  }

  return dispatch(flagAsUsed(usedAddresses));
};

/**
 * Action to sync bitcoin address data with Pine server.
 */
export const sync = (newTransactions) => {
  return (dispatch) => {
    if (!newTransactions || newTransactions.length === 0) {
      return Promise.resolve();
    }

    dispatch(syncRequest());

    /**
     * Send the current unused address index to the Pine server
     * so it knows from where to generate new addresses.
     */
    return dispatch(setIndex())
      .then(() => {
        return flagAddressesAsUsed(dispatch, newTransactions);
      })
      .then(() => {
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
      });
  };
};
