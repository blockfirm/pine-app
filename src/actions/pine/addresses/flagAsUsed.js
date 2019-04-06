import flagAsUsedOnPineServer from '../../../pineApi/user/address/flagAsUsed';

export const PINE_ADDRESSES_FLAG_AS_USED_REQUEST = 'PINE_ADDRESSES_FLAG_AS_USED_REQUEST';
export const PINE_ADDRESSES_FLAG_AS_USED_SUCCESS = 'PINE_ADDRESSES_FLAG_AS_USED_SUCCESS';
export const PINE_ADDRESSES_FLAG_AS_USED_FAILURE = 'PINE_ADDRESSES_FLAG_AS_USED_FAILURE';

const flagAsUsedRequest = () => {
  return {
    type: PINE_ADDRESSES_FLAG_AS_USED_REQUEST
  };
};

const flagAsUsedSuccess = () => {
  return {
    type: PINE_ADDRESSES_FLAG_AS_USED_SUCCESS
  };
};

const flagAsUsedFailure = (error) => {
  return {
    type: PINE_ADDRESSES_FLAG_AS_USED_FAILURE,
    error
  };
};

/**
 * Action to flag bitcoin addresses as used. Used for telling the Pine server that an address
 * has been used so that it can be deallocated from contacts who has allocated it.
 *
 * @param {array} addresses - Array of used bitcoin addresses (strings).
 */
export const flagAsUsed = (addresses) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    if (addresses.length === 0 || !credentials) {
      return Promise.resolve();
    }

    dispatch(flagAsUsedRequest());

    return flagAsUsedOnPineServer(addresses, credentials)
      .then(() => {
        dispatch(flagAsUsedSuccess());
      })
      .catch((error) => {
        dispatch(flagAsUsedFailure(error));
        throw error;
      });
  };
};
