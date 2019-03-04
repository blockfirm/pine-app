import * as contactsActions from '../../actions/contacts';
import * as contactRequestsActions from '../../actions/contacts/contactRequests';

const items = (state = {}, action) => {
  let newState;
  let contact;

  switch (action.type) {
    case contactsActions.CONTACTS_LOAD_SUCCESS:
    case contactRequestsActions.CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS:
      return action.contacts;

    case contactsActions.CONTACTS_ADD_SUCCESS:
      contact = { ...action.contact };

      return {
        ...state,
        [action.contact.id]: contact
      };

    case contactsActions.CONTACTS_REMOVE_SUCCESS:
    case contactRequestsActions.CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS:
      newState = { ...state };
      delete newState[action.contact.id];
      return newState;

    case contactsActions.CONTACTS_REMOVE_ALL_SUCCESS:
      return {};

    case contactRequestsActions.CONTACTS_CONTACT_REQUESTS_ACCEPT_SUCCESS:
      contact = { ...action.contact };
      newState = { ...state };

      Object.values(newState).forEach((oldContact) => {
        if (oldContact.pineAddress === contact.pineAddress) {
          delete newState[oldContact.id];
        }
      });

      newState[contact.id] = contact;

      return newState;

    default:
      return state;
  }
};

export default items;
