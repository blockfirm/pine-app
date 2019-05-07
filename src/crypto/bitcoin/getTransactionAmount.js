/**
 * Whether a vout pays to one of the specified wallet addresses.
 */
const hasWalletAddress = (vout, externalAddresses, internalAddresses) => {
  return vout.scriptPubKey.addresses.some((address) => {
    return address in externalAddresses || address in internalAddresses;
  });
};

/**
 * Whether a vout pays to one of the specified external addresses.
 */
const hasExternalWalletAddress = (vout, externalAddresses) => {
  return vout.scriptPubKey.addresses.some((address) => {
    return address in externalAddresses;
  });
};

/**
 * Gets the amount of a transaction.
 *
 * @param {Object} transaction - Transaction to get amount for (same structure as stored in state).
 * @param {Object} externalAddresses - Address map of external addresses as stored in state.
 * @param {Object} internalAddresses - Address map of internal addresses as stored in state.
 *
 * @returns {number} Sent amounts as negative numbers and received amounts as positive (in BTC).
 */
const getTransactionAmount = (transaction, externalAddresses, internalAddresses) => {
  const externalVouts = transaction.vout.filter((vout) => {
    return hasExternalWalletAddress(vout, externalAddresses);
  });

  if (externalVouts.length > 0) {
    return externalVouts.reduce((sum, vout) => {
      return sum + vout.value;
    }, 0);
  }

  const recipientVouts = transaction.vout.filter((vout) => {
    return !hasWalletAddress(vout, externalAddresses, internalAddresses);
  });

  // Sent amounts are returned as negative numbers.
  return recipientVouts.reduce((sum, vout) => {
    return sum - vout.value;
  }, 0);
};

export default getTransactionAmount;
