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
        txid: transaction.txid,
        confirmed: transaction.confirmations > 0,
        reserved: false,
        reservedBtcAmount: 0,
        reservationExpiresAt: null
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
 * Flags UTXOs as internal by setting `internal` to true if the UTXO pays
 * to an internal address (change address).
 *
 * @param {array} utxos - List of UTXOs.
 * @param {object} internalAddresses - Set of internal addresses in the format { <address>: {} }.
 */
const flagInternalUtxos = (utxos, internalAddresses) => {
  utxos.forEach((utxo) => {
    utxo.internal = hasWalletAddress(utxo, {}, internalAddresses);
  });
};

/**
 * Flags UTXOs as reserved if the same UTXO was flagged as reserved
 * in the old UTXO set.
 *
 * @param {array} utxos - The updated list of UTXOs.
 * @param {array} oldUtxos - The old list of UTXOs.
 */
const preserveReservedUtxos = (utxos, oldUtxos) => {
  if (!oldUtxos || oldUtxos.length === 0) {
    return;
  }

  const reservedUtxos = {};

  // Create a map of all reserved UTXOs from the old UTXO set.
  oldUtxos.forEach((utxo) => {
    // Don't include expired reservations.
    if (utxo.reserved && (!utxo.reservationExpiresAt || utxo.reservationExpiresAt > Date.now() / 1000)) {
      reservedUtxos[utxo.txid] = reservedUtxos[utxo.txid] || {};
      reservedUtxos[utxo.txid][utxo.n] = utxo;
    }
  });

  /**
   * Flag UTXOs as reserved if the same UTXO was reserved in the old UTXO set
   * and the reservation hasn't expired.
   */
  utxos.forEach((utxo) => {
    if (reservedUtxos[utxo.txid] && reservedUtxos[utxo.txid][utxo.n]) {
      const { reservedBtcAmount, reservationExpiresAt } = reservedUtxos[utxo.txid][utxo.n];

      utxo.reserved = true;
      utxo.reservedBtcAmount = reservedBtcAmount;
      utxo.reservationExpiresAt = reservationExpiresAt;
    }
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
    utxos = utxos.filter((utxo) => {
      return hasWalletAddress(utxo, externalAddresses, internalAddresses);
    });

    // Flag internal UTXOs (change).
    flagInternalUtxos(utxos, internalAddresses);

    // Preserve reserved UTXOs.
    preserveReservedUtxos(utxos, wallet.utxos.items);

    dispatch(updateSuccess(utxos));

    // Save utxos to persistent storage.
    return dispatch(save()).then(() => utxos);
  };
};
