import * as contactsActions from '../../../../src/actions/contacts';
import contactsItemsReducer from '../../../../src/reducers/contacts/items';

describe('contactsItemsReducer', () => {
  it('is a function', () => {
    expect(typeof contactsItemsReducer).toBe('function');
  });

  describe('when action is CONTACTS_LOAD_SUCCESS', () => {
    it('returns the contacts from the action', () => {
      const oldState = { '56c7a336-4640-499d-a772-446ba7828afd': {} };
      const actionContacts = { 'fac68540-514d-403a-9e40-b87905007214': {} };
      const action = { type: contactsActions.CONTACTS_LOAD_SUCCESS, contacts: actionContacts };
      const newState = contactsItemsReducer(oldState, action);

      expect(newState).toBe(actionContacts);
    });
  });

  describe('when action is CONTACTS_SYNC_CONTACT_REQUESTS_SUCCESS', () => {
    it('returns the contacts from the action', () => {
      const oldState = { '9f4aeb36-063a-49cc-b926-51d106673f7b': {} };
      const actionContacts = { 'e42eb09e-f393-48dd-a26c-be1779347514': {} };
      const action = { type: contactsActions.CONTACTS_SYNC_CONTACT_REQUESTS_SUCCESS, contacts: actionContacts };
      const newState = contactsItemsReducer(oldState, action);

      expect(newState).toBe(actionContacts);
    });
  });

  describe('when action is CONTACTS_ADD_SUCCESS', () => {
    it('returns the contacts with the new contact added', () => {
      const oldState = { 'ab87fa02-02cf-4be5-9076-db20cf15211d': {} };
      const actionContact = { id: '91817ff5-3b89-4b85-8c9d-c50eab11840f' };
      const action = { type: contactsActions.CONTACTS_ADD_SUCCESS, contact: actionContact };
      const newState = contactsItemsReducer(oldState, action);

      const expectedState = {
        'ab87fa02-02cf-4be5-9076-db20cf15211d': {},
        '91817ff5-3b89-4b85-8c9d-c50eab11840f': {}
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is CONTACTS_REMOVE_SUCCESS', () => {
    it('returns the contacts with the contact removed', () => {
      const oldState = {
        'bd15f0cc-45d9-46de-b3e0-8690b0ffbbcd': {},
        '5eb1d832-6264-4dc6-b914-b2021fe7edb7': {}
      };

      const actionContact = { id: 'bd15f0cc-45d9-46de-b3e0-8690b0ffbbcd' };
      const action = { type: contactsActions.CONTACTS_REMOVE_SUCCESS, contact: actionContact };
      const newState = contactsItemsReducer(oldState, action);

      const expectedState = {
        '5eb1d832-6264-4dc6-b914-b2021fe7edb7': {}
      };

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('when action is CONTACTS_REMOVE_ALL_SUCCESS', () => {
    it('returns an empty object', () => {
      const action = { type: contactsActions.CONTACTS_REMOVE_ALL_SUCCESS };
      const newState = contactsItemsReducer(undefined, action);

      expect(newState).toEqual({});
    });
  });

  describe('when action is of an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { contacts: '1346201e-b5b5-4fa5-acb2-6cc202ccfc6b' };
      const action = { type: 'UNKNOWN' };
      const newState = contactsItemsReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = contactsItemsReducer(undefined, action);

      expect(newState).toMatchObject({});
    });
  });
});
