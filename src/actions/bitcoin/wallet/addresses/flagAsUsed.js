export const BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED = 'BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED';

/**
 * Action to flag a list of addresses as used.
 */
export const flagAsUsed = (addresses) => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED,
    addresses
  };
};
