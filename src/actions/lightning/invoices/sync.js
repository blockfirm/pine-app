import config from '../../../config';
import { getUnredeemedInvoices } from '../../paymentServer/lightning/getUnredeemedInvoices';
import { add as addInvoices } from './add';
import { updateAll as updateAllInvoices } from './updateAll';

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

/**
 * Syncs unredeemed invoices for incoming payments.
 */
const syncIncoming = async (dispatch) => {
  const invoices = await dispatch(getUnredeemedInvoices());

  invoices.forEach((invoice) => {
    invoice.redeem = true; // Flag invoice to be redeemed.
  });

  await dispatch(addInvoices(invoices));
};

/**
 * Syncs outgoing invoices for sent payments.
 */
const syncOutgoing = async (dispatch) => {
  await dispatch(updateAllInvoices());
};

export const sync = () => {
  return async (dispatch) => {
    if (!config.lightning.enabled) {
      return;
    }

    dispatch(syncRequest());

    try {
      await syncOutgoing(dispatch);
    } catch (error) {
      /**
       * Ignore errors - they will be retried again the next sync.
       */
    }

    try {
      await syncIncoming(dispatch);
    } catch (error) {
      dispatch(syncFailure(error));
      throw error;
    }

    dispatch(syncSuccess());
  };
};
