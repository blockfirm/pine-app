import * as api from '../../../clients/api';

export const NETWORK_SERVER_GET_INFO_REQUEST = 'NETWORK_SERVER_GET_INFO_REQUEST';
export const NETWORK_SERVER_GET_INFO_SUCCESS = 'NETWORK_SERVER_GET_INFO_SUCCESS';
export const NETWORK_SERVER_GET_INFO_FAILURE = 'NETWORK_SERVER_GET_INFO_FAILURE';

const getInfoRequest = () => {
  return {
    type: NETWORK_SERVER_GET_INFO_REQUEST
  };
};

const getInfoSuccess = (info) => {
  return {
    type: NETWORK_SERVER_GET_INFO_SUCCESS,
    info
  };
};

const getInfoFailure = (error) => {
  return {
    type: NETWORK_SERVER_GET_INFO_FAILURE,
    error
  };
};

/**
 * Action to get information about the API server and its bitcoin node.
 *
 * @returns {object} containing server information and status.
 */
export const getInfo = () => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(getInfoRequest());

    return api.info.get(options)
      .then((info) => {
        dispatch(getInfoSuccess(info));
        return info;
      })
      .catch((error) => {
        dispatch(getInfoFailure(error));
        throw error;
      });
  };
};
