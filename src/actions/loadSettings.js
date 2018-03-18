import { Settings } from 'react-native';
import deepmerge from 'deepmerge';
import config from '../config';

export const LOAD_SETTINGS_REQUEST = 'LOAD_SETTINGS_REQUEST';
export const LOAD_SETTINGS_SUCCESS = 'LOAD_SETTINGS_SUCCESS';
export const LOAD_SETTINGS_FAILURE = 'LOAD_SETTINGS_FAILURE';

const SETTINGS_KEY = 'settings';

const loadSettingsRequest = () => {
  return {
    type: LOAD_SETTINGS_REQUEST
  };
};

const loadSettingsSuccess = (settings) => {
  return {
    type: LOAD_SETTINGS_SUCCESS,
    settings
  };
};

const loadSettingsFailure = (error) => {
  return {
    type: LOAD_SETTINGS_FAILURE,
    error
  };
};

export const loadSettings = () => {
  return (dispatch) => {
    let settings;

    dispatch(loadSettingsRequest());

    try {
      // Get saved settings.
      const savedSettings = Settings.get(SETTINGS_KEY) || {};

      // Merge saved settings with defaults from config.
      settings = deepmerge(config, savedSettings);
    } catch (error) {
      dispatch(loadSettingsFailure(error));
      throw error;
    }

    dispatch(loadSettingsSuccess(settings));

    return settings;
  };
};
