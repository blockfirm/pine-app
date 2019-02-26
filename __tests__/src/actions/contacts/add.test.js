import { add as addContactToPine } from '../../../../src/actions/pine/contacts/add';
import { save as saveContacts } from '../../../../src/actions/contacts/save';

import {
  add as addContact,
  CONTACTS_ADD_REQUEST,
  CONTACTS_ADD_SUCCESS,
  CONTACTS_ADD_FAILURE
} from '../../../../src/actions/contacts/add';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../src/actions/pine/contacts/add', () => ({
  add: jest.fn(() => Promise.resolve({
    id: 'cc461b33-1fa6-4549-bc6e-387bf1106a75',
    createdAt: 121234
  }))
}));

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_ADD_REQUEST', () => {
  it('equals "CONTACTS_ADD_REQUEST"', () => {
    expect(CONTACTS_ADD_REQUEST).toBe('CONTACTS_ADD_REQUEST');
  });
});

describe('CONTACTS_ADD_SUCCESS', () => {
  it('equals "CONTACTS_ADD_SUCCESS"', () => {
    expect(CONTACTS_ADD_SUCCESS).toBe('CONTACTS_ADD_SUCCESS');
  });
});

describe('CONTACTS_ADD_FAILURE', () => {
  it('equals "CONTACTS_ADD_FAILURE"', () => {
    expect(CONTACTS_ADD_FAILURE).toBe('CONTACTS_ADD_FAILURE');
  });
});

describe('add', () => {
  let fakeContact;

  beforeEach(() => {
    fakeContact = {
      pineAddress: 'test@localhost',
      userId: 'b287f220-c3cb-4fa6-ade5-cd5ba7d9b298',
      publicKey: '',
      username: 'test',
      displayName: 'Test'
    };

    addContactToPine.mockClear();
    saveContacts.mockClear();
  });

  it('is a function', () => {
    expect(typeof addContact).toBe('function');
  });

  it('accepts one argument', () => {
    expect(addContact.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = addContact(fakeContact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = addContact(fakeContact);
    });

    it('dispatches an action of type CONTACTS_ADD_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_ADD_REQUEST
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock);
      });

      it('resolves to the contact', () => {
        expect.hasAssertions();

        return promise.then((contact) => {
          expect(contact).toEqual(expect.objectContaining(fakeContact));
        });
      });

      it('sets contact.id to the id from addContactToPine()', () => {
        expect.hasAssertions();

        return returnedFunction(dispatchMock).then((contact) => {
          // This is mocked at the top.
          expect(contact.id).toBe('cc461b33-1fa6-4549-bc6e-387bf1106a75');
        });
      });

      it('sets contact.createdAt to the createdAt from addContactToPine()', () => {
        expect.hasAssertions();

        return returnedFunction(dispatchMock).then((contact) => {
          // This is mocked at the top.
          expect(contact.createdAt).toBe(121234);
        });
      });

      it('dispatches an action of type CONTACTS_ADD_SUCCESS with the contact', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_ADD_SUCCESS,
            contact: expect.objectContaining(fakeContact)
          });
        });
      });

      it('saves the contacts', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(saveContacts).toHaveBeenCalled();
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from addContactToPine().
        addContactToPine.mockImplementationOnce(() => Promise.reject(
          new Error('57e6d883-3be7-41c0-955f-99cdfd929b74')
        ));

        promise = addContact(fakeContact)(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('57e6d883-3be7-41c0-955f-99cdfd929b74');
        });
      });

      it('dispatches an action of type CONTACTS_ADD_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_ADD_FAILURE,
            error
          });
        });
      });
    });
  });
});
