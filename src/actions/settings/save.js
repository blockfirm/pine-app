import { Settings } from 'react-native';
import deepmerge from 'deepmerge';
import { load as loadSettings } from './load';

export const SETTINGS_SAVE_REQUEST = 'SETTINGS_SAVE_REQUEST';
export const SETTINGS_SAVE_SUCCESS = 'SETTINGS_SAVE_SUCCESS';
export const SETTINGS_SAVE_FAILURE = 'SETTINGS_SAVE_FAILURE';

const SETTINGS_KEY = 'settings';

const saveRequest = () => {
  return {
    type: SETTINGS_SAVE_REQUEST
  };
};

const saveSuccess = () => {
  return {
    type: SETTINGS_SAVE_SUCCESS
  };
};

const saveFailure = (error) => {
  return {
    type: SETTINGS_SAVE_FAILURE,
    error
  };
};

export const save = (newSettings) => {
  return (dispatch) => {
    let settings;

    dispatch(saveRequest());

    try {
      // Get saved settings.
      const savedSettings = Settings.get(SETTINGS_KEY) || {};

      // Merge saved settings with new settings.
      settings = deepmerge(savedSettings, newSettings);

      // Save merged settings.
      Settings.set({ settings });
    } catch (error) {
      dispatch(saveFailure(error));
      throw error;
    }

    // Reload settings.
    dispatch(loadSettings());
    dispatch(saveSuccess());
  };
};
