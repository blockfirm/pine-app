import { AppState } from 'react-native';
import { beginBackgroundTask, endBackgroundTask } from 'react-native-begin-background-task';
import { redeemInvoice } from '../../paymentServer/lightning';
import { createInvoice } from '../createInvoice';
import { save } from './save';

export const LIGHTNING_INVOICES_REDEEM_REQUEST = 'LIGHTNING_INVOICES_REDEEM_REQUEST';
export const LIGHTNING_INVOICES_REDEEM_SUCCESS = 'LIGHTNING_INVOICES_REDEEM_SUCCESS';
export const LIGHTNING_INVOICES_REDEEM_FAILURE = 'LIGHTNING_INVOICES_REDEEM_FAILURE';

const redeemRequest = () => {
  return {
    type: LIGHTNING_INVOICES_REDEEM_REQUEST
  };
};

const redeemSuccess = (invoice) => {
  return {
    type: LIGHTNING_INVOICES_REDEEM_SUCCESS,
    invoice
  };
};

const redeemFailure = (invoice, error) => {
  return {
    type: LIGHTNING_INVOICES_REDEEM_FAILURE,
    invoice,
    error
  };
};

/**
 * Action to redeem an unredeemed invoice.
 *
 * @param {Object} invoice - Invoice to redeem.
 * @param {string} invoice.id - ID of the invoice.
 * @param {string} invoice.paidAmount - The amount that was paid in satoshis.
 */
export const redeem = (invoice) => {
  return async (dispatch) => {
    // Only redeem if app is active.
    if (AppState.currentState !== 'active') {
      return;
    }

    const backgroundTaskId = await beginBackgroundTask();

    dispatch(redeemRequest());

    try {
      const paymentRequest = await dispatch(createInvoice(invoice.paidAmount));
      await dispatch(redeemInvoice(invoice.id, paymentRequest));
    } catch (error) {
      dispatch(redeemFailure(invoice, error));
      await dispatch(save());
      throw error;
    } finally {
      await endBackgroundTask(backgroundTaskId);
    }

    dispatch(redeemSuccess(invoice));
    await dispatch(save());
  };
};
