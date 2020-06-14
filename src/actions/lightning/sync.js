import { getClient } from '../../clients/lightning';
import { redeemAll } from './invoices';
import { getBalance } from './getBalance';

export const PINE_LIGHTNING_SYNC_REQUEST = 'PINE_LIGHTNING_SYNC_REQUEST';
export const PINE_LIGHTNING_SYNC_SUCCESS = 'PINE_LIGHTNING_SYNC_SUCCESS';
export const PINE_LIGHTNING_SYNC_FAILURE = 'PINE_LIGHTNING_SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: PINE_LIGHTNING_SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: PINE_LIGHTNING_SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: PINE_LIGHTNING_SYNC_FAILURE,
    error
  };
};

export const sync = () => {
  return (dispatch) => {
    const client = getClient();

    if (!client || !client.ready || client.disconnected) {
      return Promise.resolve();
    }

    dispatch(syncRequest());

    return dispatch(getBalance())
      .then(() => {
        return dispatch(redeemAll()).catch(() => {
          /**
           * Ignore redemption errors - they are logged and retried again the next sync.
           */
        });
      })
      .then(() => dispatch(syncSuccess()))
      .catch((error) => {
        dispatch(syncFailure(error));
      });
  };
};
