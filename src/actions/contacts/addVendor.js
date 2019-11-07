import uuidv4 from 'uuid/v4';
import { save } from './save';

export const CONTACTS_ADD_VENDOR = 'CONTACTS_ADD_VENDOR';

/**
 * Action to add a vendor as a contact. These are receive-only are used for displaying
 * incoming transactions from a specific vendor, e.g. Azteco Bitcoin Vouchers.
 *
 * @param {string} vendorId - ID of the vendor.
 * @param {Object} options - Contact options.
 * @param {string} contact.associatedAddresses - Addresses associated with this vendor.
 *
 * @returns {Promise} A promise that resolves to the added contact.
 */
export const addVendor = (vendorId, options) => {
  const { associatedAddresses } = options;

  return (dispatch) => {
    const contact = {
      id: uuidv4(),
      isVendor: true,
      createdAt: Math.floor(Date.now() / 1000),
      vendorId,
      associatedAddresses
    };

    dispatch({
      type: CONTACTS_ADD_VENDOR,
      contact
    });

    return dispatch(save()).then(() => contact);
  };
};
