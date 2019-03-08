import { save as saveSettings } from './save';

export const SETTINGS_SAVE_USER_PROFILE_REQUEST = 'SETTINGS_SAVE_USER_PROFILE_REQUEST';
export const SETTINGS_SAVE_USER_PROFILE_SUCCESS = 'SETTINGS_SAVE_USER_PROFILE_SUCCESS';
export const SETTINGS_SAVE_USER_PROFILE_FAILURE = 'SETTINGS_SAVE_USER_PROFILE_FAILURE';

const saveUserProfileRequest = () => {
  return {
    type: SETTINGS_SAVE_USER_PROFILE_REQUEST
  };
};

const saveUserProfileSuccess = () => {
  return {
    type: SETTINGS_SAVE_USER_PROFILE_SUCCESS
  };
};

const saveUserProfileFailure = (error) => {
  return {
    type: SETTINGS_SAVE_USER_PROFILE_FAILURE,
    error
  };
};

export const saveUserProfile = (address, user) => {
  return (dispatch) => {
    dispatch(saveUserProfileRequest());

    const newSettings = {
      user: {
        profile: {
          id: user.id,
          publicKey: user.publicKey,
          displayName: user.displayName || user.username,
          avatar: user.avatar,
          address
        }
      }
    };

    try {
      dispatch(saveSettings(newSettings));
    } catch (error) {
      dispatch(saveUserProfileFailure(error));
      throw error;
    }

    dispatch(saveUserProfileSuccess());
  };
};
