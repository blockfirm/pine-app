import uuidv4 from 'uuid/v4';
import { save } from './save';

export const CONTACTS_ADD_LEGACY = 'CONTACTS_ADD_LEGACY';

/**
 * Action to add a bitcoin address as a contact.
 *
 * @param {object} contact - Contact to add.
 * @param {string} contact.address - The contact's bitcoin address (not Pine address).
 *
 * @returns {Promise} A promise that resolves to the added contact.
 */
export const addLegacy = (contact) => {
  return (dispatch) => {
    contact.id = uuidv4();
    contact.isBitcoinAddress = true;
    contact.createdAt = Math.floor(Date.now() / 1000);

    dispatch({
      type: CONTACTS_ADD_LEGACY,
      contact
    });

    return dispatch(save()).then(() => contact);
  };
};
