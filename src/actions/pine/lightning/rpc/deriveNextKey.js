import * as bip32 from 'bip32';

export const PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY = 'PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY';

/**
 * Action that returns a key descriptor for the next private key in
 * the specified key family. It does not contain the private key.
 *
 * @param {Object} request
 * @param {number} request.keyFamily - Key family index of the key.
 *
 * @returns {Promise.Object} A promise resolving to an object with a key descriptor.
 */
export const deriveNextKey = ({ keyFamily }) => {
  const keyIndex = 1; // TODO: Increment so that a new key is always returned.

  return async (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    if (!credentials) {
      throw new Error('Missing user credentials');
    }

    dispatch({ type: PINE_LIGHTNING_RPC_DERIVE_NEXT_KEY });

    const { extendedPublicKey } = credentials.lightning;
    const path = `${keyFamily}/0/${keyIndex}`;
    const derivedKey = bip32.fromBase58(extendedPublicKey).derivePath(path);

    const keyDescriptor = {
      publicKey: derivedKey.publicKey,
      keyLocator: {
        keyFamily,
        index: keyIndex
      }
    };

    return { keyDescriptor };
  };
};
