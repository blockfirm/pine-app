import { Settings } from 'react-native';
import { load as loadSettings } from './load';

export const SETTINGS_RESET_REQUEST = 'SETTINGS_RESET_REQUEST';
export const SETTINGS_RESET_SUCCESS = 'SETTINGS_RESET_SUCCESS';
export const SETTINGS_RESET_FAILURE = 'SETTINGS_RESET_FAILURE';

const resetRequest = () => {
  return {
    type: SETTINGS_RESET_REQUEST
  };
};

const resetSuccess = () => {
  return {
    type: SETTINGS_RESET_SUCCESS
  };
};

const resetFailure = (error) => {
  return {
    type: SETTINGS_RESET_FAILURE,
    error
  };
};

export const reset = () => {
  return (dispatch) => {
    const settings = {};

    dispatch(resetRequest());

    try {
      // Remove all saved settings.
      Settings.set({ settings });
    } catch (error) {
      dispatch(resetFailure(error));
      throw error;
    }

    // Reload settings to get defaults.
    dispatch(loadSettings());
    dispatch(resetSuccess());
  };
};
