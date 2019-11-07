import { save } from './save';

export const CONTACTS_ADD_VENDOR_ASSOCIATED_ADDRESS = 'CONTACTS_ADD_VENDOR_ASSOCIATED_ADDRESS';

/**
 * Action to add a bitcoin address to the associated addresses of a vendor contact.
 *
 * @param {string} vendorId - ID of the vendor.
 * @param {string} address - Address to associate with the vendor.
 *
 * @returns {Promise} A promise that resolves when the address has been added and saved.
 */
export const addVendorAssociatedAddress = (vendorId, address) => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_ADD_VENDOR_ASSOCIATED_ADDRESS,
      vendorId,
      address
    });

    return dispatch(save());
  };
};
