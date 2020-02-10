import { handle as handleError } from '../../error';
import { add as addInvoices } from '../../lightning/invoices';
import { getBalance } from './getBalance';
import { getUnredeemedInvoices } from './getUnredeemedInvoices';

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
      .then(() => dispatch(syncSuccess()))
      .catch((error) => {
        dispatch(syncFailure(error));
        dispatch(handleError(error));
      });
  };
};
