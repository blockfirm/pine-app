import { AsyncStorage } from 'react-native';

export const CONTACTS_SAVE_REQUEST = 'CONTACTS_SAVE_REQUEST';
export const CONTACTS_SAVE_SUCCESS = 'CONTACTS_SAVE_SUCCESS';
export const CONTACTS_SAVE_FAILURE = 'CONTACTS_SAVE_FAILURE';

const CONTACTS_STORAGE_KEY = '@Contacts';

const saveRequest = () => {
  return {
    type: CONTACTS_SAVE_REQUEST
  };
};

const saveSuccess = () => {
  return {
    type: CONTACTS_SAVE_SUCCESS
  };
};

const saveFailure = (error) => {
  return {
    type: CONTACTS_SAVE_FAILURE,
    error
  };
};

export const save = () => {
  return (dispatch, getState) => {
    dispatch(saveRequest());

    const items = getState().contacts.items;
    const serialized = JSON.stringify(items);

    return AsyncStorage.setItem(CONTACTS_STORAGE_KEY, serialized)
      .then(() => {
        dispatch(saveSuccess());
      })
      .catch((error) => {
        dispatch(saveFailure(error));
        throw error;
      });
  };
};
