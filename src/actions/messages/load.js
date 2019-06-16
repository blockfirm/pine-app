import AsyncStorage from '@react-native-community/async-storage';

export const MESSAGES_LOAD_REQUEST = 'MESSAGES_LOAD_REQUEST';
export const MESSAGES_LOAD_SUCCESS = 'MESSAGES_LOAD_SUCCESS';
export const MESSAGES_LOAD_FAILURE = 'MESSAGES_LOAD_FAILURE';

const MESSAGES_STORAGE_KEY = '@Messages';

const getStorageKey = (contactId) => {
  return `${MESSAGES_STORAGE_KEY}/${contactId}`;
};

const loadRequest = () => {
  return {
    type: MESSAGES_LOAD_REQUEST
  };
};

const loadSuccess = (contactId, messages) => {
  return {
    type: MESSAGES_LOAD_SUCCESS,
    contactId,
    messages
  };
};

const loadFailure = (error) => {
  return {
    type: MESSAGES_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load all messages for a specific contact from persistent
 * storage into state.
 *
 * @param {string} contactId - ID of the contact to load messages for.
 *
 * @returns {Promise.Object[]} A promise that resolves to the loaded messages.
 */
export const load = (contactId) => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(getStorageKey(contactId))
      .then((result) => {
        const messages = JSON.parse(result) || [];
        dispatch(loadSuccess(contactId, messages));
        return messages;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
