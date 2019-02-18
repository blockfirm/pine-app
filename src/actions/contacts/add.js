import uuidv4 from 'uuid/v4';
import { save } from './save';

export const CONTACTS_ADD_REQUEST = 'CONTACTS_ADD_REQUEST';
export const CONTACTS_ADD_SUCCESS = 'CONTACTS_ADD_SUCCESS';
export const CONTACTS_ADD_FAILURE = 'CONTACTS_ADD_FAILURE';

const addRequest = () => {
  return {
    type: CONTACTS_ADD_REQUEST
  };
};

const addSuccess = (contact) => {
  return {
    type: CONTACTS_ADD_SUCCESS,
    contact
  };
};

const addFailure = (error) => {
  return {
    type: CONTACTS_ADD_FAILURE,
    error
  };
};

export const add = (contact) => {
  return (dispatch) => {
    dispatch(addRequest());

    contact.id = uuidv4();

    dispatch(addSuccess(contact));

    return dispatch(save())
      .then(() => contact)
      .catch((error) => {
        dispatch(addFailure(error));
        throw error;
      });
  };
};
