import { getUnredeemedInvoices } from '../../paymentServer/lightning/getUnredeemedInvoices';
import { add as addInvoices } from './add';

export const PINE_LIGHTNING_INVOICES_SYNC_REQUEST = 'PINE_LIGHTNING_INVOICES_SYNC_REQUEST';
export const PINE_LIGHTNING_INVOICES_SYNC_SUCCESS = 'PINE_LIGHTNING_INVOICES_SYNC_SUCCESS';
export const PINE_LIGHTNING_INVOICES_SYNC_FAILURE = 'PINE_LIGHTNING_INVOICES_SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: PINE_LIGHTNING_INVOICES_SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: PINE_LIGHTNING_INVOICES_SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: PINE_LIGHTNING_INVOICES_SYNC_FAILURE,
    error
  };
};

export const sync = () => {
  return async (dispatch) => {
    dispatch(syncRequest());

    try {
      const invoices = await dispatch(getUnredeemedInvoices());
      await dispatch(addInvoices(invoices));
    } catch (error) {
      dispatch(syncFailure(error));
      throw error;
    }

    dispatch(syncSuccess());
  };
};
