export const KEYS_REMOVE_REQUEST = 'KEYS_REMOVE_REQUEST';
export const KEYS_REMOVE_SUCCESS = 'KEYS_REMOVE_SUCCESS';
export const KEYS_REMOVE_FAILURE = 'KEYS_REMOVE_FAILURE';

const removeRequest = () => {
  return {
    type: KEYS_REMOVE_REQUEST
  };
};

const removeSuccess = (key) => {
  return {
    type: KEYS_REMOVE_SUCCESS,
    key
  };
};

const removeFailure = (error) => {
  return {
    type: KEYS_REMOVE_FAILURE,
    error
  };
};

export const remove = (key) => {
  return (dispatch) => {
    dispatch(removeRequest());

    return Promise.resolve().then(() => {
      if (!key || !key.id) {
        const error = new Error('Unknown key.');
        dispatch(removeFailure(error));
        throw error;
      }

      dispatch(removeSuccess(key));

      return key;
    });
  };
};
