import { AsyncStorage } from 'react-native';

export const MESSAGES_REMOVE_ALL_FOR_CONTACT_REQUEST = 'MESSAGES_REMOVE_ALL_FOR_CONTACT_REQUEST';
export const MESSAGES_REMOVE_ALL_FOR_CONTACT_SUCCESS = 'MESSAGES_REMOVE_ALL_FOR_CONTACT_SUCCESS';
export const MESSAGES_REMOVE_ALL_FOR_CONTACT_FAILURE = 'MESSAGES_REMOVE_ALL_FOR_CONTACT_FAILURE';

const MESSAGES_STORAGE_KEY = '@Messages';

const getStorageKey = (contactId) => {
  return `${MESSAGES_STORAGE_KEY}/${contactId}`;
};

const removeAllForContactRequest = () => {
  return {
    type: MESSAGES_REMOVE_ALL_FOR_CONTACT_REQUEST
  };
};

const removeAllForContactSuccess = (contactId) => {
  return {
    type: MESSAGES_REMOVE_ALL_FOR_CONTACT_SUCCESS,
    contactId
  };
};

const removeAllForContactFailure = (error) => {
  return {
    type: MESSAGES_REMOVE_ALL_FOR_CONTACT_FAILURE,
    error
  };
};

/**
 * Action to remove all messages for a specific contact from persistent
 * storage and state.
 *
 * @param {string} contactId - ID of the contact to remove all messages for.
 *
 * @returns {Promise} A promise that resolves when the messages has been removed.
 */
export const removeAllForContact = (contactId) => {
  return (dispatch) => {
    dispatch(removeAllForContactRequest());

    return AsyncStorage.removeItem(getStorageKey(contactId))
      .then(() => {
        dispatch(removeAllForContactSuccess(contactId));
      })
      .catch((error) => {
        dispatch(removeAllForContactFailure(error));
        throw error;
      });
  };
};
