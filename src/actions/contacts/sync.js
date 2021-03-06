import getUser from '../../clients/paymentServer/user/get';
import { get as getContacts } from '../paymentServer/contacts/get';
import { save } from './save';

export const CONTACTS_SYNC_REQUEST = 'CONTACTS_SYNC_REQUEST';
export const CONTACTS_SYNC_SUCCESS = 'CONTACTS_SYNC_SUCCESS';
export const CONTACTS_SYNC_FAILURE = 'CONTACTS_SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: CONTACTS_SYNC_REQUEST
  };
};

const syncSuccess = (contacts) => {
  return {
    type: CONTACTS_SYNC_SUCCESS,
    contacts
  };
};

const syncFailure = (error) => {
  return {
    type: CONTACTS_SYNC_FAILURE,
    error
  };
};

const syncExisting = (contacts, serverContacts) => {
  let synced = false;

  const serverContactMap = serverContacts.reduce((map, serverContact) => {
    map[serverContact.address] = serverContact;
    return map;
  }, {});

  Object.values(contacts).forEach((contact) => {
    if (!(contact.address in serverContactMap)) {
      return;
    }

    const serverContact = serverContactMap[contact.address];
    const updatedContact = { ...contact };

    updatedContact.waitingForContactRequest = serverContact.waitingForContactRequest;

    if (!updatedContact.waitingForContactRequest) {
      delete updatedContact.contactRequest;

      if (contact.waitingForContactRequest) {
        updatedContact.unread = true;
      }
    }

    contacts[updatedContact.id] = updatedContact;
    synced = true;
  });

  return synced;
};

const addUserAsContact = (user, serverContact, contacts, pineAddress) => {
  const contact = {
    ...user,
    ...serverContact,
    userId: user.id,
    address: serverContact.address
  };

  if (contact.waitingForContactRequest) {
    contact.contactRequest = {
      from: pineAddress,
      createdAt: contact.createdAt
    };
  }

  contacts[contact.id] = contact;
};

const addNew = (contacts, serverContacts, pineAddress) => {
  let added = false;

  const contactMap = Object.values(contacts).reduce((map, contact) => {
    map[contact.address] = contact;
    return map;
  }, {});

  const newContacts = serverContacts.filter((serverContact) => {
    return !(serverContact.address in contactMap);
  });

  const promises = newContacts.map((newContact) => {
    return getUser(newContact.address)
      .then((user) => {
        addUserAsContact(user, newContact, contacts, pineAddress);
        added = true;
      })
      .catch(() => {
        // Ignore errors.
      });
  });

  return Promise.all(promises).then(() => added);
};

/**
 * Action to sync contacts with server.
 *
 * - New contacts are added
 * - Outgoing contact requests are updated if changed
 *
 * @returns {Promise} A promise that resolves to the updated contacts.
 */
export const sync = () => {
  return (dispatch, getState) => {
    let contacts;
    let synced = false;

    dispatch(syncRequest());

    return dispatch(getContacts())
      .then((serverContacts) => {
        const state = getState();
        const userProfile = state.settings.user.profile;

        contacts = { ...state.contacts.items };
        synced = syncExisting(contacts, serverContacts);

        return addNew(contacts, serverContacts, userProfile.address);
      })
      .then((added) => {
        dispatch(syncSuccess(contacts));

        if (synced || added) {
          return dispatch(save());
        }
      })
      .then(() => contacts)
      .catch((error) => {
        dispatch(syncFailure(error));
        throw error;
      });
  };
};
