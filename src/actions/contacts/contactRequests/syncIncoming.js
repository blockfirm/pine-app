import uuidv4 from 'uuid/v4';
import { InteractionManager } from 'react-native';

import getUser from '../../../pineApi/user/get';
import { get as getContactRequests } from '../../pine/contactRequests/get';
import { save } from '../save';

export const CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST = 'CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST';
export const CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS = 'CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS';
export const CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE = 'CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE';

const syncIncomingRequest = () => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST
  };
};

const syncIncomingSuccess = (contacts) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS,
    contacts
  };
};

const syncIncomingFailure = (error) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE,
    error
  };
};

const waitForInteractions = () => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(resolve);
  });
};

const syncExisting = (contacts, contactRequests, pineAddress) => {
  let synced = false;

  const contactRequestMap = contactRequests.reduce((map, contactRequest) => {
    map[contactRequest.from] = contactRequest;
    return map;
  }, {});

  Object.values(contacts).forEach((contact) => {
    const { contactRequest } = contact;

    if (!contactRequest) {
      return;
    }

    if (contactRequest.from === pineAddress) {
      return;
    }

    if (contactRequest.from in contactRequestMap) {
      contact.contactRequest = { ...contactRequestMap[contactRequest.from] };
      contactRequestMap[contactRequest.from].updated = true;
    } else {
      delete contacts[contact.id];
    }

    synced = true;
  });

  return synced;
};

const addNew = async (contacts, contactRequests) => {
  let added = false;

  const newContactRequests = contactRequests.filter((contactRequest) => {
    return !contactRequest.updated;
  });

  for (const newContactRequest of newContactRequests) {
    let user;

    try {
      user = await getUser(newContactRequest.from);
    } catch (error) {
      continue;
    }

    user.userId = user.id;
    user.id = uuidv4();
    user.address = newContactRequest.from;
    user.createdAt = newContactRequest.createdAt;

    user.contactRequest = {
      id: newContactRequest.id,
      from: newContactRequest.from,
      createdAt: newContactRequest.createdAt
    };

    contacts[user.id] = user;
    added = true;
  }

  return added;
};

/**
 * Action to sync incoming contact requests with server.
 *
 * - Old contact requests are removed
 * - Pending contact requests are updated if changed
 * - New contact requests are added as contacts
 *
 * @returns {Promise} A promise that resolves to the updated contacts.
 */
export const syncIncoming = () => {
  return (dispatch, getState) => {
    const state = getState();
    const userProfile = state.settings.user.profile;
    const contacts = { ...state.contacts.items };
    let synced = false;

    dispatch(syncIncomingRequest());

    return waitForInteractions()
      .then(() => {
        return dispatch(getContactRequests());
      })
      .then((contactRequests) => {
        synced = syncExisting(contacts, contactRequests, userProfile.address);
        return addNew(contacts, contactRequests);
      })
      .then((added) => {
        dispatch(syncIncomingSuccess(contacts));

        if (synced || added) {
          return dispatch(save());
        }
      })
      .then(() => contacts)
      .catch((error) => {
        dispatch(syncIncomingFailure(error));
        throw error;
      });
  };
};
