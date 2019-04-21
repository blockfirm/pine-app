import { AsyncStorage } from 'react-native';

export const MESSAGES_REMOVE_ALL_REQUEST = 'MESSAGES_REMOVE_ALL_REQUEST';
export const MESSAGES_REMOVE_ALL_SUCCESS = 'MESSAGES_REMOVE_ALL_SUCCESS';
export const MESSAGES_REMOVE_ALL_FAILURE = 'MESSAGES_REMOVE_ALL_FAILURE';

const MESSAGES_STORAGE_KEY = '@Messages';

const getStorageKey = (contactId) => {
  return `${MESSAGES_STORAGE_KEY}/${contactId}`;
};

const removeAllRequest = () => {
  return {
    type: MESSAGES_REMOVE_ALL_REQUEST
  };
};

const removeAllSuccess = () => {
  return {
    type: MESSAGES_REMOVE_ALL_SUCCESS
  };
};

const removeAllFailure = (error) => {
  return {
    type: MESSAGES_REMOVE_ALL_FAILURE,
    error
  };
};

/**
 * Action to remove all messages from persistent storage and state.
 *
 * @returns {Promise} A promise that resolves when the messages has been removed.
 */
export const removeAll = () => {
  return (dispatch, getState) => {
    dispatch(removeAllRequest());

    const contacts = getState().contacts.items || {};
    const contactIds = Object.keys(contacts);

    const promises = contactIds.map((contactId) => {
      return AsyncStorage.removeItem(getStorageKey(contactId));
    });

    return Promise.all(promises)
      .then(() => {
        dispatch(removeAllSuccess());
      })
      .catch((error) => {
        dispatch(removeAllFailure(error));
        throw error;
      });
  };
};
