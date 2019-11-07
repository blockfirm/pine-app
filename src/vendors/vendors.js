export const VENDOR_AZTECO = 'azteco';

export default {
  [VENDOR_AZTECO]: {
    displayName: 'Azteco',
    url: 'https://azte.co',
    logo: require('../images/vendors/Azteco.png'),

    /**
     * Texts displayed under the vendor contact on the home screen.
     */

    // Shown when the vendor contact has been added.
    addedText: 'Was added as a new vendor',

    // Shown when a voucher has been redeemed.
    receivedText: 'You redeemed'
  }
};
