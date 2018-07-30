import uuidv4 from 'uuid/v4';
import { save } from './save';

export const KEYS_ADD_REQUEST = 'KEYS_ADD_REQUEST';
export const KEYS_ADD_SUCCESS = 'KEYS_ADD_SUCCESS';

export const addRequest = () => {
  return {
    type: KEYS_ADD_REQUEST
  };
};

export const addSuccess = (key) => {
  return {
    type: KEYS_ADD_SUCCESS,
    key
  };
};

export const add = (key) => {
  return (dispatch) => {
    dispatch(addRequest());

    key.id = key.id || uuidv4();

    dispatch(addSuccess(key));

    return dispatch(save()).then(() => key);
  };
};
