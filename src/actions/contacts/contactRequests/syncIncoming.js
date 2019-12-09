import uuidv4 from 'uuid/v4';
import getUser from '../../../clients/paymentServer/user/get';
import { get as getContactRequests } from '../../paymentServer/contactRequests/get';
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

const createContactFromContactRequest = async (contactRequest) => {
  let contact;

  try {
    contact = await getUser(contactRequest.from);
  } catch (error) {
    return;
  }

  contact.userId = contact.id;
  contact.id = uuidv4();
  contact.address = contactRequest.from;
  contact.createdAt = contactRequest.createdAt;
  contact.unread = true;

  contact.contactRequest = {
    id: contactRequest.id,
    from: contactRequest.from,
    createdAt: contactRequest.createdAt
  };

  return contact;
};

const addNew = async (contacts, contactRequests) => {
  let added = false;

  const newContactRequests = contactRequests.filter((contactRequest) => {
    return !contactRequest.updated;
  });

  for (const newContactRequest of newContactRequests) {
    const contact = await createContactFromContactRequest(newContactRequest);

    if (contact) {
      contacts[contact.id] = contact;
      added = true;
    }
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
    let contacts;
    let synced = false;

    dispatch(syncIncomingRequest());

    return dispatch(getContactRequests())
      .then((contactRequests) => {
        const state = getState();
        const userProfile = state.settings.user.profile;

        contacts = { ...state.contacts.items };
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
