import AsyncStorage from '@react-native-community/async-storage';

export const LIGHTNING_INVOICES_SAVE_REQUEST = 'LIGHTNING_INVOICES_SAVE_REQUEST';
export const LIGHTNING_INVOICES_SAVE_SUCCESS = 'LIGHTNING_INVOICES_SAVE_SUCCESS';
export const LIGHTNING_INVOICES_SAVE_FAILURE = 'LIGHTNING_INVOICES_SAVE_FAILURE';

const LIGHTNING_INVOICES_STORAGE_KEY = '@Lightning/Invoices';

const saveRequest = () => {
  return {
    type: LIGHTNING_INVOICES_SAVE_REQUEST
  };
};

const saveSuccess = () => {
  return {
    type: LIGHTNING_INVOICES_SAVE_SUCCESS
  };
};

const saveFailure = (error) => {
  return {
    type: LIGHTNING_INVOICES_SAVE_FAILURE,
    error
  };
};

/**
 * Action to persist all invoices from state to AsyncStorage.
 */
export const save = () => {
  return (dispatch, getState) => {
    dispatch(saveRequest());

    const items = getState().lightning.invoices.items;
    const serialized = JSON.stringify(items);

    return AsyncStorage.setItem(LIGHTNING_INVOICES_STORAGE_KEY, serialized)
      .then(() => {
        dispatch(saveSuccess());
      })
      .catch((error) => {
        dispatch(saveFailure(error));
        throw error;
      });
  };
};
