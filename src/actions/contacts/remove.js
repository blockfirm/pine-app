import { remove as removeContactFromServer } from '../paymentServer/contacts/remove';
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
 * @param {boolean} [contact.isBitcoinAddress] - Whether the contact is for a bitcoin address and not a Pine user.
 * @param {boolean} [contact.isVendor] - Whether the contact is a vendor or not.
 *
 * @returns {Promise} A promise that resolves to the removed contact.
 */
export const remove = (contact) => {
  return (dispatch) => {
    dispatch(removeRequest());

    return Promise.resolve()
      .then(() => {
        if (!contact.isBitcoinAddress && !contact.isVendor) {
          return dispatch(removeContactFromServer(contact));
        }
      })
      .then(() => {
        /**
         * The actual contact is removed by the reducer so this
         * action must be dispatched before saving the state.
         */
        dispatch(removeSuccess(contact));

        return dispatch(save()).then(() => contact);
      })
      .catch((error) => {
        dispatch(removeFailure(error));
        throw error;
      });
  };
};
