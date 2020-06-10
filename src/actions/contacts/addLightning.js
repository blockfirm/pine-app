import uuidv4 from 'uuid/v4';
import { save } from './save';

export const CONTACTS_ADD_LIGHTNING = 'CONTACTS_ADD_LIGHTNING';

/**
 * Action to add a lightning node as a contact.
 *
 * @param {Object} contact - Contact to add.
 * @param {string} contact.lightningNodeKey - The contact's lightning node public key.
 *
 * @returns {Promise} A promise that resolves to the added contact.
 */
export const addLightning = (contact) => {
  return (dispatch) => {
    contact.id = uuidv4();
    contact.isLightningNode = true;
    contact.createdAt = Math.floor(Date.now() / 1000);

    dispatch({
      type: CONTACTS_ADD_LIGHTNING,
      contact
    });

    return dispatch(save()).then(() => contact);
  };
};
