import { save as saveContacts } from '../../../../../src/actions/contacts/save';
import { removeOutgoing as removeOutgoingContactRequest } from '../../../../../src/actions/pine/contactRequests/removeOutgoing';
import { remove as removeContactFromServer } from '../../../../../src/actions/pine/contacts/remove';

import {
  remove as removeContactRequestAction,
  CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST,
  CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS,
  CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE
} from '../../../../../src/actions/contacts/contactRequests/remove';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../../src/actions/pine/contactRequests/removeOutgoing', () => ({
  removeOutgoing: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/pine/contacts/remove', () => ({
  remove: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST).toBe('CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST');
  });
});

describe('CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS).toBe('CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS');
  });
});

describe('CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE).toBe('CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE');
  });
});

describe('remove', () => {
  let contact;

  beforeEach(() => {
    contact = {
      userId: '2759c61c-3643-4238-ac34-a493eed14d78',
      pineAddress: 'test@localhost',
      contactRequest: {
        id: '9835b4b2-d828-4c2d-9b61-9214d88587cf'
      }
    };

    dispatchMock.mockClear();
    removeContactFromServer.mockClear();
    removeOutgoingContactRequest.mockClear();
    saveContacts.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeContactRequestAction).toBe('function');
  });

  it('accepts one argument', () => {
    expect(removeContactRequestAction.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = removeContactRequestAction(contact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = removeContactRequestAction(contact);
    });

    it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST
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

      it('removes the contact request', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(removeOutgoingContactRequest).toHaveBeenCalledWith(expect.objectContaining({
            id: contact.contactRequest.id,
            to: contact.pineAddress,
            toUserId: contact.userId
          }));
        });
      });

      it('removes the contact from the server', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(removeContactFromServer).toHaveBeenCalledWith(contact);
        });
      });

      it('resolves to the passed contact', () => {
        expect.hasAssertions();

        return promise.then((passedContact) => {
          expect(passedContact).toBe(passedContact);
        });
      });

      it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS with the passed contact', () => {
        expect.hasAssertions();

        return promise.then((passedContact) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS,
            contact: passedContact
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
        // Make the function fail by returning a rejected promise from removeContactFromServer().
        removeContactFromServer.mockImplementationOnce(() => Promise.reject(
          new Error('02dec68c-1fae-4758-96fb-7487355c39cf')
        ));

        promise = removeContactRequestAction(contact)(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('02dec68c-1fae-4758-96fb-7487355c39cf');
        });
      });

      it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE,
            error
          });
        });
      });
    });
  });
});
