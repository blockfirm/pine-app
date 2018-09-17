import { save } from './save';

export const BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS = 'BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS';

const updateSuccess = (utxos) => {
  return {
    type: BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS,
    utxos
  };
};

/**
 * Extracts all vouts as a flat array from the specified transactions.
 *
 * @param {array} transactions - List of transactions.
 */
const getVouts = (transactions) => {
  const deepVouts = transactions.map((transaction) => {
    const transactionVouts = transaction.vout.map((vout) => {
      return {
        ...vout,
        txid: transaction.txid
      };
    });

    return transactionVouts;
  });

  // Flatten the array.
  return deepVouts.reduce((vouts, vout) => vouts.concat(vout), []);
};

/**
 * Extracts all vins as a flat array from the specified transactions.
 *
 * @param {array} transactions - List of transactions.
 */
const getVins = (transactions) => {
  const deepVins = transactions.map((transaction) => transaction.vin);

  // Flatten the array.
  return deepVins.reduce((vins, vin) => vins.concat(vin), []);
};

/**
 * Builds a deep map of vins based on their txid and vout index.
 *
 * @param {array} vins - List of vins.
 */
const buildVinMap = (vins) => {
  const vinMap = {};

  vins.forEach((vin) => {
    vinMap[vin.txid] = vinMap[vin.txid] || {};
    vinMap[vin.txid][vin.vout] = true;
  });

  return vinMap;
};

/**
 * Returns whether or not a transaction output pays to an address specified in
 * `externalAddresses` or `internalAddresses`.
 *
 * @param {object} vout - Transaction output object.
 * @param {object} externalAddresses - Set of addresses in the format { <address>: {} }.
 * @param {object} internalAddresses - Set of addresses in the format { <address>: {} }.
 */
const hasWalletAddress = (vout, externalAddresses, internalAddresses) => {
  return vout.scriptPubKey.addresses.some((address) => {
    return address in externalAddresses || address in internalAddresses;
  });
};

/**
 * Action to do a scan of all transactions to find and save
 * all unspent transaction outputs (utxos).
 *
 * This action recreates the entire utxo set each time and
 * does not yet support incremental updates.
 */
export const update = () => {
  return (dispatch, getState) => {
    const wallet = getState().bitcoin.wallet;
    const transactions = wallet.transactions.items || [];
    const externalAddresses = wallet.addresses.external.items || {};
    const internalAddresses = wallet.addresses.internal.items || {};

    const vins = getVins(transactions);
    const vouts = getVouts(transactions);
    const vinMap = buildVinMap(vins);

    // Find all unspent transaction outputs.
    let utxos = vouts.filter((vout) => {
      // If the vout is used as a vin, then it's already spent.
      return !(vinMap[vout.txid] && vinMap[vout.txid][vout.n]);
    });

    // Filter outputs that pays to an address in this wallet.
    utxos = utxos.filter((vout) => {
      return hasWalletAddress(vout, externalAddresses, internalAddresses);
    });

    dispatch(updateSuccess(utxos));

    // Save utxos to persistent storage.
    return dispatch(save()).then(() => utxos);
  };
};
