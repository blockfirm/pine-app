import getUser from '../../pineApi/user/get';
import { get as getContacts } from '../pine/contacts/get';
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

const addNew = async (contacts, serverContacts, pineAddress) => {
  let added = false;

  const contactMap = Object.values(contacts).reduce((map, contact) => {
    map[contact.address] = contact;
    return map;
  }, {});

  const newContacts = serverContacts.filter((serverContact) => {
    return !(serverContact.address in contactMap);
  });

  for (const newContact of newContacts) {
    try {
      const user = await getUser(newContact.address);
      addUserAsContact(user, newContact, contacts, pineAddress);
      added = true;
    } catch (error) {
      // Ignore errors.
    }
  }

  return added;
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
    const state = getState();
    const userProfile = state.settings.user.profile;
    const contacts = { ...state.contacts.items };
    let synced = false;

    dispatch(syncRequest());

    return dispatch(getContacts())
      .then((serverContacts) => {
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
