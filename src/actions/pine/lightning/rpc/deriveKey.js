import bip32 from 'bip32';

export const PINE_LIGHTNING_RPC_DERIVE_KEY = 'PINE_LIGHTNING_RPC_DERIVE_KEY';

/**
 * Action that returns a key descriptor for a private key specified
 * by the passed key locator. It does not contain the private key.
 *
 * @param {Object} request
 * @param {Object} request.keyLocator - Object describing the key to derive.
 * @param {number} request.keyLocator.keyFamily - Key family index of the key.
 * @param {number} request.keyLocator.index - Index of the key.
 *
 * @returns {Promise.Object} A promise resolving to an object with a key descriptor.
 */
export const deriveKey = ({ keyLocator }) => {
  const { keyFamily, index } = keyLocator;

  return async (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    if (!credentials) {
      throw new Error('Missing user credentials');
    }

    dispatch({ type: PINE_LIGHTNING_RPC_DERIVE_KEY });

    const { extendedPublicKey } = credentials.lightning;
    const path = `${keyFamily}/0/${index}`;
    const derivedKey = bip32.fromBase58(extendedPublicKey).derivePath(path);

    const keyDescriptor = {
      publicKey: derivedKey.publicKey,
      keyLocator
    };

    return { keyDescriptor };
  };
};
