/**
 * Finds an external wallet address the vout pays to, if any.
 */
const findExternalWalletAddress = (vout, externalAddresses) => {
  return vout.scriptPubKey.addresses.find((address) => {
    return address in externalAddresses;
  });
};

/**
 * Finds an internal wallet address the vout pays to, if any.
 */
const findInternalWalletAddress = (vout, internalAddresses) => {
  return vout.scriptPubKey.addresses.find((address) => {
    return address in internalAddresses;
  });
};

/**
 * Gets the recipient address of a transaction.
 *
 * Note: Although a transaction can pay to multiple addresses, this function
 * will only return one because Pine can only pay to one address at a time.
 *
 * @param {Object} transaction - Transaction to get address for (same structure as stored in state).
 * @param {Object} externalAddresses - Address map of external addresses as stored in state.
 * @param {Object} internalAddresses - Address map of internal addresses as stored in state.
 *
 * @returns {string} Bitcoin address the transaction is paying to.
 */
const getTransactionAddress = (transaction, externalAddresses, internalAddresses) => {
  let externalAddress;
  let internalAddress;

  transaction.vout.find((vout) => {
    externalAddress = findExternalWalletAddress(vout, externalAddresses);
    return externalAddress;
  });

  if (externalAddress) {
    return externalAddress;
  }

  transaction.vout.find((vout) => {
    internalAddress = findInternalWalletAddress(vout, internalAddresses);
    return internalAddress;
  });

  return internalAddress;
};

export default getTransactionAddress;
