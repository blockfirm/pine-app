import { Settings } from 'react-native';
import { loadSettings } from './loadSettings';

export const RESET_SETTINGS_REQUEST = 'RESET_SETTINGS_REQUEST';
export const RESET_SETTINGS_SUCCESS = 'RESET_SETTINGS_SUCCESS';
export const RESET_SETTINGS_FAILURE = 'RESET_SETTINGS_FAILURE';

const resetSettingsRequest = () => {
  return {
    type: RESET_SETTINGS_REQUEST
  };
};

const resetSettingsSuccess = () => {
  return {
    type: RESET_SETTINGS_SUCCESS
  };
};

const resetSettingsFailure = (error) => {
  return {
    type: RESET_SETTINGS_FAILURE,
    error
  };
};

export const resetSettings = () => {
  return (dispatch) => {
    const settings = {};

    dispatch(resetSettingsRequest());

    try {
      // Remove all saved settings.
      Settings.set({ settings });
    } catch (error) {
      dispatch(resetSettingsFailure(error));
      throw error;
    }

    // Reload settings (to get defaults).
    dispatch(loadSettings());
    dispatch(resetSettingsSuccess());
  };
};
