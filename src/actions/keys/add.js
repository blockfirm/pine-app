import uuidv4 from 'uuid/v4';
import getKeyMetadata from '../../crypto/getKeyMetadata';
import saveMnemonicByKey from '../../crypto/saveMnemonicByKey';
import { save } from './save';

export const KEYS_ADD_REQUEST = 'KEYS_ADD_REQUEST';
export const KEYS_ADD_SUCCESS = 'KEYS_ADD_SUCCESS';
export const KEYS_ADD_FAILURE = 'KEYS_ADD_FAILURE';

const addRequest = () => {
  return {
    type: KEYS_ADD_REQUEST
  };
};

const addSuccess = (key) => {
  return {
    type: KEYS_ADD_SUCCESS,
    key
  };
};

const addFailure = (error) => {
  return {
    type: KEYS_ADD_FAILURE,
    error
  };
};

export const add = (mnemonic) => {
  return (dispatch, getState) => {
    dispatch(addRequest());

    const state = getState();
    const network = state.settings.bitcoin.network;
    const accountIndex = 0;
    const metadata = getKeyMetadata(mnemonic, network, accountIndex);

    metadata.id = uuidv4();

    // Save mnemonic separately in Keychain.
    return saveMnemonicByKey(mnemonic, metadata.id)
      .then(() => {
        dispatch(addSuccess(metadata));
        return dispatch(save()).then(() => metadata);
      })
      .catch((error) => {
        dispatch(addFailure(error));
        throw error;
      });
  };
};
