export const PINE_LIGHTNING_RPC_NEW_ADDRESS = 'PINE_LIGHTNING_RPC_NEW_ADDRESS';

const ADDRESS_TYPE_WITNESS_PUBKEY = 1; // BIP84 (p2wpkh)
const ADDRESS_TYPE_NESTED_WITNESS_PUBKEY = 2; // BIP49 (p2sh-p2wpkh)

/**
 * Action that returns a new address to be used with a lightning channel.
 *
 * @param {Object} request
 * @param {number} request.type - Type of address to return.
 * @param {boolean} request.change - Whether the new address should be a change address or not.
 *
 * @returns {Promise.Object} A promise resolving to an object with the new address.
 */
export const newAddress = ({ type, change }) => {
  return async (dispatch, getState) => {
    const state = getState();
    let address;

    if (type !== ADDRESS_TYPE_WITNESS_PUBKEY && type !== ADDRESS_TYPE_NESTED_WITNESS_PUBKEY) {
      throw new Error(`Address type ${type} not supported`);
    }

    if (change) {
      address = state.bitcoin.wallet.addresses.internal.unused;
    } else {
      address = state.bitcoin.wallet.addresses.external.unused;
    }

    dispatch({ type: PINE_LIGHTNING_RPC_NEW_ADDRESS, address });

    return { address };
  };
};
