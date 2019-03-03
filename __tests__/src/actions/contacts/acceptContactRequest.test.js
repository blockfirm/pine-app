import { save as saveContacts } from '../../../../src/actions/contacts/save';
import { send as sendContactRequest } from '../../../../src/actions/pine/contactRequests/send';
import { add as addContactToPine } from '../../../../src/actions/pine/contacts/add';

import {
  acceptContactRequest,
  CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST,
  CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS,
  CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE
} from '../../../../src/actions/contacts/acceptContactRequest';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../src/actions/pine/contactRequests/send', () => ({
  send: jest.fn(() => Promise.resolve({}))
}));

jest.mock('../../../../src/actions/pine/contacts/add', () => ({
  add: jest.fn(() => Promise.resolve({
    id: '63b6d3cf-4810-4237-a08a-fc06a2e043b3',
    createdAt: 12345
  }))
}));

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST', () => {
  it('equals "CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST"', () => {
    expect(CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST).toBe('CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST');
  });
});

describe('CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS', () => {
  it('equals "CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS"', () => {
    expect(CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS).toBe('CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS');
  });
});

describe('CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE', () => {
  it('equals "CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE"', () => {
    expect(CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE).toBe('CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE');
  });
});

describe('acceptContactRequest', () => {
  let contact;

  beforeEach(() => {
    contact = {
      contactRequest: {
        id: 'da40fde9-f5d6-4662-891c-b7c00f93c9dd',
        from: 'from@localhost'
      }
    };

    dispatchMock.mockClear();
    addContactToPine.mockClear();
  });

  it('is a function', () => {
    expect(typeof acceptContactRequest).toBe('function');
  });

  it('accepts one argument', () => {
    expect(acceptContactRequest.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = acceptContactRequest(contact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = acceptContactRequest(contact);
    });

    it('dispatches an action of type CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST
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

      it('sends a contact request back to the sender to flag that is was accepted', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(sendContactRequest).toHaveBeenCalledWith(contact.contactRequest.from);
        });
      });

      it('adds contact to Pine server', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(addContactToPine).toHaveBeenCalledWith({
            pineAddress: contact.contactRequest.from
          });
        });
      });

      it('resolves to the updated contact', () => {
        expect.hasAssertions();

        return promise.then((updatedContact) => {
          expect(updatedContact).toEqual(expect.objectContaining({
            ...updatedContact,
            id: '63b6d3cf-4810-4237-a08a-fc06a2e043b3',
            createdAt: 12345
          }));

          expect(updatedContact.contactRequest).toBeUndefined();
        });
      });

      it('dispatches an action of type CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS with the updated contact', () => {
        expect.hasAssertions();

        return promise.then((updatedContact) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS,
            contact: updatedContact
          });
        });
      });

      it('saves the state', () => {
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
          new Error('74f1195a-f883-4ca0-8607-a31dd3a3195f')
        ));

        promise = acceptContactRequest(contact)(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('74f1195a-f883-4ca0-8607-a31dd3a3195f');
        });
      });

      it('dispatches an action of type CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE,
            error
          });
        });
      });
    });
  });
});
