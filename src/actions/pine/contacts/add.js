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

const addSuccess = (contact) => {
  return {
    type: PINE_CONTACTS_ADD_SUCCESS,
    contact
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
 * Action to add a contact to the user's Pine server.
 *
 * @param {string} address - Pine address of the contact to add.
 */
export const add = (address) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { pineAddress } = state.settings.user.profile;

    dispatch(addRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return addContact(pineAddress, address, mnemonic);
      })
      .then((contact) => {
        dispatch(addSuccess(contact));
        return contact;
      })
      .catch((error) => {
        dispatch(addFailure(error));
        throw error;
      });
  };
};
