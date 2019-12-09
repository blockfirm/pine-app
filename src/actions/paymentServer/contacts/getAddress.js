import getAddressForUser from '../../../clients/paymentServer/user/address/get';

export const PINE_CONTACTS_GET_ADDRESS_REQUEST = 'PINE_CONTACTS_GET_ADDRESS_REQUEST';
export const PINE_CONTACTS_GET_ADDRESS_SUCCESS = 'PINE_CONTACTS_GET_ADDRESS_SUCCESS';
export const PINE_CONTACTS_GET_ADDRESS_FAILURE = 'PINE_CONTACTS_GET_ADDRESS_FAILURE';

const getAddressRequest = () => {
  return {
    type: PINE_CONTACTS_GET_ADDRESS_REQUEST
  };
};

const getAddressSuccess = (address) => {
  return {
    type: PINE_CONTACTS_GET_ADDRESS_SUCCESS,
    address
  };
};

const getAddressFailure = (error) => {
  return {
    type: PINE_CONTACTS_GET_ADDRESS_FAILURE,
    error
  };
};

/**
 * Action to get a bitcoin address for a contact.
 *
 * @param {object} contact - Contact to get a bitcoin address for.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.address - The contact's Pine address.
 */
export const getAddress = (contact) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(getAddressRequest());

    return getAddressForUser(contact, credentials)
      .then((address) => {
        dispatch(getAddressSuccess(address));
        return address;
      })
      .catch((error) => {
        dispatch(getAddressFailure(error));
        throw error;
      });
  };
};
