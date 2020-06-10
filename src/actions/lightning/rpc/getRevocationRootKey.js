import getMnemonicByKey from '../../../crypto/getMnemonicByKey';
import { getLightningKeyPairFromMnemonic } from '../../../clients/paymentServer/crypto';

export const PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY = 'PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY';

const KEY_FAMILY_REVOCATION_ROOT = 5;

const getMnemonic = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action that returns a new revocation root key.
 *
 * @param {Object} request
 * @param {number} request.keyIndex - Index of the key.
 *
 * @returns {Promise.Object} A promise resolving to an object with a private key.
 */
export const getRevocationRootKey = ({ keyIndex }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { network } = state.settings.bitcoin;

    dispatch({ type: PINE_LIGHTNING_RPC_GET_REVOCATION_ROOT_KEY });

    const mnemonic = await getMnemonic(state.keys.items);
    const lightningKeyPair = getLightningKeyPairFromMnemonic(mnemonic, network);
    const path = `${KEY_FAMILY_REVOCATION_ROOT}/0/${keyIndex}`;
    const revocationRootKey = lightningKeyPair.derivePath(path);
    const privateKey = revocationRootKey.privateKey;

    return { privateKey };
  };
};
