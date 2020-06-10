export const PINE_LIGHTNING_RPC_IS_OUR_ADDRESS = 'PINE_LIGHTNING_RPC_IS_OUR_ADDRESS';

/**
 * Action that returns whether an address belongs to the user or not.
 *
 * @param {Object} request
 * @param {string} request.address - Address to check.
 *
 * @returns {Promise.boolean} A promise resolving to true or false.
 */
export const isOurAddress = ({ address }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const externalAddresses = state.bitcoin.wallet.addresses.external.items;
    const internalAddresses = state.bitcoin.wallet.addresses.internal.items;

    dispatch({ type: PINE_LIGHTNING_RPC_IS_OUR_ADDRESS });

    const result = address in externalAddresses || address in internalAddresses;

    return { isOurAddress: result };
  };
};
