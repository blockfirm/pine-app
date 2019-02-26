import { save as saveContacts } from '../../../../src/actions/contacts/save';

import {
  removeAll as removeAllContacts,
  CONTACTS_REMOVE_ALL_SUCCESS
} from '../../../../src/actions/contacts/removeAll';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_REMOVE_ALL_SUCCESS', () => {
  it('equals "CONTACTS_REMOVE_ALL_SUCCESS"', () => {
    expect(CONTACTS_REMOVE_ALL_SUCCESS).toBe('CONTACTS_REMOVE_ALL_SUCCESS');
  });
});

describe('removeAll', () => {
  it('is a function', () => {
    expect(typeof removeAllContacts).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(removeAllContacts.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = removeAllContacts();
    expect(typeof returnValue).toBe('function');
  });

  it('dispatches an action of type CONTACTS_REMOVE_ALL_SUCCESS', () => {
    removeAllContacts()(dispatchMock);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: CONTACTS_REMOVE_ALL_SUCCESS
    });
  });

  it('saves the state', () => {
    removeAllContacts()(dispatchMock);
    expect(saveContacts).toHaveBeenCalled();
  });
});
