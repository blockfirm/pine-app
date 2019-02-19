import addContact from '../../../PinePaymentProtocol/user/contacts/add';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';

export const PINE_CONTACTS_ADD_REQUEST = 'PINE_CONTACTS_ADD_REQUEST';
export const PINE_CONTACTS_ADD_SUCCESS = 'PINE_CONTACTS_ADD_SUCCESS';
export const PINE_CONTACTS_ADD_FAILURE = 'PINE_CONTACTS_ADD_FAILURE';

const addRequest = () => {
  return {
    type: PINE_CONTACTS_ADD_REQUEST
  };
};

const addSuccess = (contactId) => {
  return {
    type: PINE_CONTACTS_ADD_SUCCESS,
    contactId
  };
};

const addFailure = (error) => {
  return {
    type: PINE_CONTACTS_ADD_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to add a contact.
 */
export const add = (address) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { pineAddress } = state.settings.user.profile;

    if (!pineAddress) {
      return Promise.resolve();
    }

    dispatch(addRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return addContact(pineAddress, address, mnemonic);
      })
      .then((contactId) => {
        dispatch(addSuccess(contactId));
        return contactId;
      })
      .catch((error) => {
        dispatch(addFailure(error));
        throw error;
      });
  };
};
