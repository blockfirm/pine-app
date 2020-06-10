import getUnredeemedInvoicesFromServer from '../../../clients/paymentServer/user/lightning/invoices/getUnredeemed';

export const PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_REQUEST = 'PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_REQUEST';
export const PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_SUCCESS = 'PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_SUCCESS';
export const PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_FAILURE = 'PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_FAILURE';

const getUnredeemedInvoicesRequest = () => {
  return {
    type: PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_REQUEST
  };
};

const getUnredeemedInvoicesSuccess = (invoices) => {
  return {
    type: PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_SUCCESS,
    invoices
  };
};

const getUnredeemedInvoicesFailure = (error) => {
  return {
    type: PINE_LIGHTNING_GET_UNREDEEMED_INVOICES_FAILURE,
    error
  };
};

/**
 * Action to get all unredeemed lightning invoices from the Pine server.
 */
export const getUnredeemedInvoices = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(getUnredeemedInvoicesRequest());

    return getUnredeemedInvoicesFromServer(credentials)
      .then((invoices) => {
        dispatch(getUnredeemedInvoicesSuccess(invoices));
        return invoices;
      })
      .catch((error) => {
        dispatch(getUnredeemedInvoicesFailure(error));
        throw error;
      });
  };
};
