import getContacts from '../../../PinePaymentProtocol/user/contacts/get';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';

export const PINE_CONTACTS_GET_REQUEST = 'PINE_CONTACTS_GET_REQUEST';
export const PINE_CONTACTS_GET_SUCCESS = 'PINE_CONTACTS_GET_SUCCESS';
export const PINE_CONTACTS_GET_FAILURE = 'PINE_CONTACTS_GET_FAILURE';

const getRequest = () => {
  return {
    type: PINE_CONTACTS_GET_REQUEST
  };
};

const getSuccess = (contacts) => {
  return {
    type: PINE_CONTACTS_GET_SUCCESS,
    contacts
  };
};

const getFailure = (error) => {
  return {
    type: PINE_CONTACTS_GET_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to get all contacts from the user's Pine server.
 */
export const get = () => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { pineAddress } = state.settings.user.profile;

    dispatch(getRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return getContacts(pineAddress, mnemonic);
      })
      .then((contacts) => {
        dispatch(getSuccess(contacts));
        return contacts;
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
