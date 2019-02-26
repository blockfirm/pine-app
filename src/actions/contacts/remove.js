import { save } from './save';

export const CONTACTS_REMOVE_REQUEST = 'CONTACTS_REMOVE_REQUEST';
export const CONTACTS_REMOVE_SUCCESS = 'CONTACTS_REMOVE_SUCCESS';
export const CONTACTS_REMOVE_FAILURE = 'CONTACTS_REMOVE_FAILURE';

const removeRequest = () => {
  return {
    type: CONTACTS_REMOVE_REQUEST
  };
};

const removeSuccess = (contact) => {
  return {
    type: CONTACTS_REMOVE_SUCCESS,
    contact
  };
};

const removeFailure = (error) => {
  return {
    type: CONTACTS_REMOVE_FAILURE,
    error
  };
};

/**
 * Action to remove a contact.
 *
 * @param {object} contact - Contact to remove.
 * @param {string} contact.id - The contact's ID (not user ID).
 *
 * @returns {Promise} A promise that resolves to the removed contact.
 */
export const remove = (contact) => {
  return (dispatch) => {
    dispatch(removeRequest());

    return Promise.resolve().then(() => {
      if (!contact || !contact.id) {
        const error = new Error('Unknown contact.');
        dispatch(removeFailure(error));
        throw error;
      }

      /**
       * The actual contact is removed by the reducer so this
       * action must be dispatched before saving the state.
       */
      dispatch(removeSuccess(contact));

      return dispatch(save()).then(() => contact);
    });
  };
};
