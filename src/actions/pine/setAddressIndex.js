import updateUser from '../../pineApi/user/update';

export const PINE_SET_ADDRESS_INDEX_REQUEST = 'PINE_SET_ADDRESS_INDEX_REQUEST';
export const PINE_SET_ADDRESS_INDEX_SUCCESS = 'PINE_SET_ADDRESS_INDEX_SUCCESS';
export const PINE_SET_ADDRESS_INDEX_FAILURE = 'PINE_SET_ADDRESS_INDEX_FAILURE';

const setAddressIndexRequest = () => {
  return {
    type: PINE_SET_ADDRESS_INDEX_REQUEST
  };
};

const setAddressIndexSuccess = () => {
  return {
    type: PINE_SET_ADDRESS_INDEX_SUCCESS
  };
};

const setAddressIndexFailure = (error) => {
  return {
    type: PINE_SET_ADDRESS_INDEX_FAILURE,
    error
  };
};

/**
 * Action to save the index of the next unused address
 * to the user's Pine account. This is used by the server
 * to generate new unused addresses.
 */
export const setAddressIndex = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;
    const addresses = Object.keys(state.bitcoin.wallet.addresses.external.items);
    const addressIndex = addresses.length > 0 ? (addresses.length - 1) : 0;

    if (!addressIndex || !credentials) {
      return Promise.resolve();
    }

    dispatch(setAddressIndexRequest());

    return updateUser({ addressIndex }, credentials)
      .then(() => {
        dispatch(setAddressIndexSuccess());
      })
      .catch((error) => {
        dispatch(setAddressIndexFailure(error));
        throw error;
      });
  };
};
