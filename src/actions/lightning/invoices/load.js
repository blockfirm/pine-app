import AsyncStorage from '@react-native-community/async-storage';

export const LIGHTNING_INVOICES_LOAD_REQUEST = 'LIGHTNING_INVOICES_LOAD_REQUEST';
export const LIGHTNING_INVOICES_LOAD_SUCCESS = 'LIGHTNING_INVOICES_LOAD_SUCCESS';
export const LIGHTNING_INVOICES_LOAD_FAILURE = 'LIGHTNING_INVOICES_LOAD_FAILURE';

const LIGHTNING_INVOICES_STORAGE_KEY = '@Lightning/Invoices';

const loadRequest = () => {
  return {
    type: LIGHTNING_INVOICES_LOAD_REQUEST
  };
};

const loadSuccess = (invoices) => {
  return {
    type: LIGHTNING_INVOICES_LOAD_SUCCESS,
    invoices
  };
};

const loadFailure = (error) => {
  return {
    type: LIGHTNING_INVOICES_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load persisted invoices into state. Returns a promise that
 * resolves to the loaded invoices as an array.
 */
export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(LIGHTNING_INVOICES_STORAGE_KEY)
      .then((result) => {
        const invoices = JSON.parse(result) || [];
        dispatch(loadSuccess(invoices));
        return invoices;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
