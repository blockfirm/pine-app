import { Settings } from 'react-native';
import deepmerge from 'deepmerge';
import { loadSettings } from './loadSettings';

export const SAVE_SETTINGS_REQUEST = 'SAVE_SETTINGS_REQUEST';
export const SAVE_SETTINGS_SUCCESS = 'SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_FAILURE = 'SAVE_SETTINGS_FAILURE';

const SETTINGS_KEY = 'settings';

const saveSettingsRequest = () => {
  return {
    type: SAVE_SETTINGS_REQUEST
  };
};

const saveSettingsSuccess = () => {
  return {
    type: SAVE_SETTINGS_SUCCESS
  };
};

const saveSettingsFailure = (error) => {
  return {
    type: SAVE_SETTINGS_FAILURE,
    error
  };
};

export const saveSettings = (newSettings) => {
  return (dispatch) => {
    let settings;

    dispatch(saveSettingsRequest());

    try {
      // Get saved settings.
      const savedSettings = Settings.get(SETTINGS_KEY) || {};

      // Merge saved settings with new settings.
      settings = deepmerge(savedSettings, newSettings);

      // Save merged settings.
      Settings.set({ settings });
    } catch (error) {
      dispatch(saveSettingsFailure(error));
      throw error;
    }

    // Reload settings.
    dispatch(loadSettings());
    dispatch(saveSettingsSuccess());
  };
};
