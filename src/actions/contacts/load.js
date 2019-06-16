import AsyncStorage from '@react-native-community/async-storage';

export const CONTACTS_LOAD_REQUEST = 'CONTACTS_LOAD_REQUEST';
export const CONTACTS_LOAD_SUCCESS = 'CONTACTS_LOAD_SUCCESS';
export const CONTACTS_LOAD_FAILURE = 'CONTACTS_LOAD_FAILURE';

const CONTACTS_STORAGE_KEY = '@Contacts';

const loadRequest = () => {
  return {
    type: CONTACTS_LOAD_REQUEST
  };
};

const loadSuccess = (contacts) => {
  return {
    type: CONTACTS_LOAD_SUCCESS,
    contacts
  };
};

const loadFailure = (error) => {
  return {
    type: CONTACTS_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load all contacts from persistent storage into state.
 *
 * @returns {Promise} A promise that resolves to the loaded contacts.
 */
export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(CONTACTS_STORAGE_KEY)
      .then((result) => {
        const contacts = JSON.parse(result) || {};
        dispatch(loadSuccess(contacts));
        return contacts;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
