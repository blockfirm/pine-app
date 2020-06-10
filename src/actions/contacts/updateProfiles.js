import getUser from '../../clients/paymentServer/user/get';
import { save } from './save';

export const CONTACTS_UPDATE_PROFILES_REQUEST = 'CONTACTS_UPDATE_PROFILES_REQUEST';
export const CONTACTS_UPDATE_PROFILES_SUCCESS = 'CONTACTS_UPDATE_PROFILES_SUCCESS';
export const CONTACTS_UPDATE_PROFILES_FAILURE = 'CONTACTS_UPDATE_PROFILES_FAILURE';

const updateProfilesRequest = () => {
  return {
    type: CONTACTS_UPDATE_PROFILES_REQUEST
  };
};

const updateProfilesSuccess = (contacts) => {
  return {
    type: CONTACTS_UPDATE_PROFILES_SUCCESS,
    contacts
  };
};

const updateProfilesFailure = (error) => {
  return {
    type: CONTACTS_UPDATE_PROFILES_FAILURE,
    error
  };
};

const shouldUpdate = (contact) => {
  const lastUpdate = contact.updatedAt || contact.createdAt || 0;
  const now = Date.now() / 1000;

  return now - lastUpdate > 60; // 1 minute.
};

const updateContact = async (contact) => {
  const user = await getUser(contact.address);

  return {
    ...contact,
    displayName: user.displayName,
    avatar: user.avatar,
    hasLightningCapacity: user.hasLightningCapacity,
    updatedAt: Date.now() / 1000
  };
};

const updateContacts = (contacts) => {
  let updated = false;

  const promises = Object.values(contacts).map((contact) => {
    if (shouldUpdate(contact)) {
      return updateContact(contact)
        .then((updatedContact) => {
          contacts[updatedContact.id] = updatedContact;
          updated = true;
        })
        .catch(() => {
          // Ignore errors.
        });
    }
  });

  return Promise.all(promises).then(() => updated);
};

/**
 * Action to update contact profiles.
 *
 * @returns {Promise} A promise that resolves to the updated contacts.
 */
export const updateProfiles = () => {
  return (dispatch, getState) => {
    const state = getState();
    const contacts = { ...state.contacts.items };

    dispatch(updateProfilesRequest());

    return updateContacts(contacts)
      .then((updated) => {
        dispatch(updateProfilesSuccess(contacts));

        if (updated) {
          return dispatch(save());
        }
      })
      .then(() => contacts)
      .catch((error) => {
        dispatch(updateProfilesFailure(error));
        throw error;
      });
  };
};
