import { AsyncStorage } from 'react-native';

export const MESSAGES_SAVE_REQUEST = 'MESSAGES_SAVE_REQUEST';
export const MESSAGES_SAVE_SUCCESS = 'MESSAGES_SAVE_SUCCESS';
export const MESSAGES_SAVE_FAILURE = 'MESSAGES_SAVE_FAILURE';

const MESSAGES_STORAGE_KEY = '@Messages';

const getStorageKey = (contactId) => {
  return `${MESSAGES_STORAGE_KEY}/${contactId}`;
};

const saveRequest = () => {
  return {
    type: MESSAGES_SAVE_REQUEST
  };
};

const saveSuccess = () => {
  return {
    type: MESSAGES_SAVE_SUCCESS
  };
};

const saveFailure = (error) => {
  return {
    type: MESSAGES_SAVE_FAILURE,
    error
  };
};

/**
 * Action to save all messages for a specific contact
 * from state to persistent storage.
 *
 * @param {string} contactId - ID of the contact to save messages for.
 *
 * @returns {Promise} A promise that resolves when the state has been persisted.
 */
export const save = (contactId) => {
  return (dispatch, getState) => {
    dispatch(saveRequest());

    const messages = getState().messages.itemsByContact[contactId];
    const serialized = JSON.stringify(messages);

    return AsyncStorage.setItem(getStorageKey(contactId), serialized)
      .then(() => {
        dispatch(saveSuccess());
      })
      .catch((error) => {
        dispatch(saveFailure(error));
        throw error;
      });
  };
};
