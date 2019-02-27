import uuidv4 from 'uuid/v4';
import { InteractionManager } from 'react-native';

import getUser from '../../PinePaymentProtocol/user/get';
import { get as getContactRequests } from '../pine/contactRequests/get';
import { save } from './save';

export const CONTACTS_SYNC_CONTACT_REQUESTS_REQUEST = 'CONTACTS_SYNC_CONTACT_REQUESTS_REQUEST';
export const CONTACTS_SYNC_CONTACT_REQUESTS_SUCCESS = 'CONTACTS_SYNC_CONTACT_REQUESTS_SUCCESS';
export const CONTACTS_SYNC_CONTACT_REQUESTS_FAILURE = 'CONTACTS_SYNC_CONTACT_REQUESTS_FAILURE';

const syncContactRequestsRequest = () => {
  return {
    type: CONTACTS_SYNC_CONTACT_REQUESTS_REQUEST
  };
};

const syncContactRequestsSuccess = (contacts) => {
  return {
    type: CONTACTS_SYNC_CONTACT_REQUESTS_SUCCESS,
    contacts
  };
};

const syncContactRequestsFailure = (error) => {
  return {
    type: CONTACTS_SYNC_CONTACT_REQUESTS_FAILURE,
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

const addNew = (contacts, contactRequests) => {
  let added = false;

  const newContactRequests = contactRequests.filter((contactRequest) => {
    return !contactRequest.updated;
  });

  const promises = newContactRequests.map((newContactRequest) => {
    return getUser(newContactRequest.from).then((user) => {
      user.userId = user.id;
      user.id = uuidv4();
      user.pineAddress = newContactRequest.from;
      user.createdAt = newContactRequest.createdAt;

      user.contactRequest = {
        id: newContactRequest.id,
        from: newContactRequest.from,
        createdAt: newContactRequest.createdAt
      };

      contacts[user.id] = user;
      added = true;
    });
  });

  return Promise.all(promises).then(() => added);
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
export const syncContactRequests = () => {
  return (dispatch, getState) => {
    const state = getState();
    const userProfile = state.settings.user.profile;
    const contacts = { ...state.contacts.items };
    let synced = false;

    dispatch(syncContactRequestsRequest());

    return waitForInteractions()
      .then(() => {
        return dispatch(getContactRequests());
      })
      .then((contactRequests) => {
        synced = syncExisting(contacts, contactRequests, userProfile.pineAddress);
        return addNew(contacts, contactRequests);
      })
      .then((added) => {
        dispatch(syncContactRequestsSuccess(contacts));

        if (synced || added) {
          return dispatch(save());
        }
      })
      .then(() => contacts)
      .catch((error) => {
        dispatch(syncContactRequestsFailure(error));
        throw error;
      });
  };
};
