import updateUser from '../../../pineApi/user/update';

export const PINE_ADDRESSES_SET_INDEX_REQUEST = 'PINE_ADDRESSES_SET_INDEX_REQUEST';
export const PINE_ADDRESSES_SET_INDEX_SUCCESS = 'PINE_ADDRESSES_SET_INDEX_SUCCESS';
export const PINE_ADDRESSES_SET_INDEX_FAILURE = 'PINE_ADDRESSES_SET_INDEX_FAILURE';

const setIndexRequest = () => {
  return {
    type: PINE_ADDRESSES_SET_INDEX_REQUEST
  };
};

const setIndexSuccess = () => {
  return {
    type: PINE_ADDRESSES_SET_INDEX_SUCCESS
  };
};

const setIndexFailure = (error) => {
  return {
    type: PINE_ADDRESSES_SET_INDEX_FAILURE,
    error
  };
};

const getUnusedAddressIndex = (addresses) => {
  const lastUsedAddressIndex = addresses.reduce((max, address) => {
    if (address.used) {
      return Math.max(max, address.index);
    }

    return max;
  }, -1);

  return lastUsedAddressIndex + 1;
};

/**
 * Action to save the index of the next unused address
 * to the user's Pine account. This is used by the server
 * to generate new unused addresses.
 */
export const setIndex = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;
    const addresses = Object.values(state.bitcoin.wallet.addresses.external.items);
    const addressIndex = getUnusedAddressIndex(addresses);

    if (!addressIndex || !credentials) {
      return Promise.resolve();
    }

    dispatch(setIndexRequest());

    return updateUser({ addressIndex }, credentials)
      .then(() => {
        dispatch(setIndexSuccess());
      })
      .catch((error) => {
        dispatch(setIndexFailure(error));
        throw error;
      });
  };
};
