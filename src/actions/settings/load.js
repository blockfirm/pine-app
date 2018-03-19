import { Settings } from 'react-native';
import deepmerge from 'deepmerge';
import config from '../../config';

export const SETTINGS_LOAD_REQUEST = 'SETTINGS_LOAD_REQUEST';
export const SETTINGS_LOAD_SUCCESS = 'SETTINGS_LOAD_SUCCESS';
export const SETTINGS_LOAD_FAILURE = 'SETTINGS_LOAD_FAILURE';

const SETTINGS_KEY = 'settings';

const loadRequest = () => {
  return {
    type: SETTINGS_LOAD_REQUEST
  };
};

const loadSuccess = (settings) => {
  return {
    type: SETTINGS_LOAD_SUCCESS,
    settings
  };
};

const loadFailure = (error) => {
  return {
    type: SETTINGS_LOAD_FAILURE,
    error
  };
};

export const load = () => {
  return (dispatch) => {
    let settings;

    dispatch(loadRequest());

    try {
      // Get saved settings.
      const savedSettings = Settings.get(SETTINGS_KEY) || {};

      // Merge saved settings with defaults from config.
      settings = deepmerge(config, savedSettings);
    } catch (error) {
      dispatch(loadFailure(error));
      throw error;
    }

    dispatch(loadSuccess(settings));

    return settings;
  };
};
