import * as contactsActions from '../../../../src/actions/contacts';
import contactsErrorReducer from '../../../../src/reducers/contacts/error';

const testRequestAction = (actionType) => {
  it('returns null', () => {
    const oldState = new Error('a1136cdc-ae95-4aec-95a1-c56731366c49');
    const action = { type: actionType };
    const newState = contactsErrorReducer(oldState, action);

    expect(newState).toBe(null);
  });
};

const testFailureAction = (actionType) => {
  it('returns the error from the action', () => {
    const oldState = new Error('44d04215-20cf-4760-8aaa-ffd94d35eccc');
    const actionError = new Error('cfd96dfe-b487-4c94-ae88-2082c2ef193c');
    const action = { type: actionType, error: actionError };
    const newState = contactsErrorReducer(oldState, action);

    expect(newState).toBe(actionError);
  });
};

describe('contactsErrorReducer', () => {
  it('is a function', () => {
    expect(typeof contactsErrorReducer).toBe('function');
  });

  describe('when action is CONTACTS_ADD_REQUEST', () => {
    testRequestAction(contactsActions.CONTACTS_ADD_REQUEST);
  });

  describe('when action is CONTACTS_LOAD_REQUEST', () => {
    testRequestAction(contactsActions.CONTACTS_LOAD_REQUEST);
  });

  describe('when action is CONTACTS_REMOVE_REQUEST', () => {
    testRequestAction(contactsActions.CONTACTS_REMOVE_REQUEST);
  });

  describe('when action is CONTACTS_SAVE_REQUEST', () => {
    testRequestAction(contactsActions.CONTACTS_SAVE_REQUEST);
  });

  describe('when action is CONTACTS_SYNC_CONTACT_REQUESTS_REQUEST', () => {
    testRequestAction(contactsActions.CONTACTS_SYNC_CONTACT_REQUESTS_REQUEST);
  });

  describe('when action is CONTACTS_LOAD_FAILURE', () => {
    testFailureAction(contactsActions.CONTACTS_LOAD_FAILURE);
  });

  describe('when action is CONTACTS_REMOVE_FAILURE', () => {
    testFailureAction(contactsActions.CONTACTS_REMOVE_FAILURE);
  });

  describe('when action is CONTACTS_SAVE_FAILURE', () => {
    testFailureAction(contactsActions.CONTACTS_SAVE_FAILURE);
  });

  describe('when action is CONTACTS_SYNC_CONTACT_REQUESTS_FAILURE', () => {
    testFailureAction(contactsActions.CONTACTS_SYNC_CONTACT_REQUESTS_FAILURE);
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { error: '09fdded4-a604-4fd6-8e46-dbbb89476bd5' };
      const action = { type: 'UNKNOWN' };
      const newState = contactsErrorReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns null', () => {
      const action = { type: 'UNKNOWN' };
      const newState = contactsErrorReducer(undefined, action);

      expect(newState).toBe(null);
    });
  });
});
