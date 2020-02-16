import { getUnredeemedInvoices } from '../paymentServer/lightning/getUnredeemedInvoices';
import { handle as handleError } from '../error';
import { add as addInvoices, redeemAll } from './invoices';
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
    dispatch(syncRequest());

    return dispatch(getBalance())
      .then(() => syncUnredeemedInvoices(dispatch))
      .then(() => {
        return dispatch(redeemAll()).catch(() => {
          /**
           * Ignore redemption errors - they are logged and managed on each payment.
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
