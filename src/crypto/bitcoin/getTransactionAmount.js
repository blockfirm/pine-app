const hasWalletAddress = (vout, externalAddresses, internalAddresses) => {
  return vout.scriptPubKey.addresses.some((address) => {
    return address in externalAddresses || address in internalAddresses;
  });
};

const hasExternalWalletAddress = (vout, externalAddresses) => {
  return vout.scriptPubKey.addresses.some((address) => {
    return address in externalAddresses;
  });
};

const getTransactionAmount = (transaction, externalAddresses, internalAddresses) => {
  const externalVouts = transaction.vout.filter((vout) => {
    return hasExternalWalletAddress(vout, externalAddresses);
  });

  if (externalVouts.length > 0) {
    const amount = externalVouts.reduce((sum, vout) => {
      return sum + vout.value;
    }, 0);

    return amount;
  }

  const recipientVouts = transaction.vout.filter((vout) => {
    return !hasWalletAddress(vout, externalAddresses, internalAddresses);
  });

  const amount = recipientVouts.reduce((sum, vout) => {
    return sum + vout.value;
  }, 0);

  return -amount;
};

export default getTransactionAmount;
