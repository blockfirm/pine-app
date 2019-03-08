import { InteractionManager } from 'react-native';

import getUser from '../../PinePaymentProtocol/user/get';
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

const waitForInteractions = () => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(resolve);
  });
};

const syncExisting = (contacts, serverContacts) => {
  let synced = false;

  const serverContactMap = serverContacts.reduce((map, serverContact) => {
    map[serverContact.address] = serverContact;
    return map;
  }, {});

  Object.values(contacts).forEach((contact) => {
    if (!(contact.pineAddress in serverContactMap)) {
      return;
    }

    const serverContact = serverContactMap[contact.pineAddress];
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

const addNew = (contacts, serverContacts, pineAddress) => {
  let added = false;

  const contactMap = Object.values(contacts).reduce((map, contact) => {
    map[contact.pineAddress] = contact;
    return map;
  }, {});

  const newContacts = serverContacts.filter((serverContact) => {
    return !(serverContact.address in contactMap);
  });

  const promises = newContacts.map((newContact) => {
    return getUser(newContact.address).then((user) => {
      const contact = {
        ...user,
        ...newContact,
        userId: user.id,
        pineAddress: newContact.address
      };

      if (contact.waitingForContactRequest) {
        contact.contactRequest = {
          from: pineAddress,
          createdAt: contact.createdAt
        };
      }

      contacts[contact.id] = contact;
      added = true;
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
    const state = getState();
    const userProfile = state.settings.user.profile;
    const contacts = { ...state.contacts.items };
    let synced = false;

    dispatch(syncRequest());

    return waitForInteractions()
      .then(() => {
        return dispatch(getContacts());
      })
      .then((serverContacts) => {
        synced = syncExisting(contacts, serverContacts);
        return addNew(contacts, serverContacts, userProfile.pineAddress);
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
