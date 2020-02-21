import { getClient } from '../../clients/lightning';
import { getUnredeemedInvoices } from '../paymentServer/lightning/getUnredeemedInvoices';
import { handle as handleError } from '../error';
import { add as addInvoices, redeemAll, updateAll } from './invoices';
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

const syncUnredeemedInvoices = async (dispatch) => {
  const invoices = await dispatch(getUnredeemedInvoices());
  return dispatch(addInvoices(invoices));
};

export const sync = () => {
  return (dispatch) => {
    console.log('LIGHTNING sync');
    const client = getClient();

    if (!client.ready || client.disconnected) {
      return Promise.resolve();
    }

    dispatch(syncRequest());

    return dispatch(getBalance())
      .then(() => syncUnredeemedInvoices(dispatch))
      .then(() => {
        return dispatch(redeemAll()).catch(() => {
          /**
           * Ignore redemption errors - they are logged and retried again the next sync.
           */
        });
      })
      .then(() => {
        return dispatch(updateAll()).catch(() => {
          /**
           * Ignore update errors - they will be retried again the next sync.
           */
        });
      })
      .then(() => dispatch(syncSuccess()))
      .catch((error) => {
        dispatch(syncFailure(error));
        dispatch(handleError(error));
      });
  };
};
