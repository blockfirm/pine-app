import { save as saveContacts } from '../../../../../src/actions/contacts/save';
import { removeIncoming as removeIncomingContactRequest } from '../../../../../src/actions/pine/contactRequests/removeIncoming';

import {
  ignore as ignoreContactRequest,
  CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST,
  CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS,
  CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE
} from '../../../../../src/actions/contacts/contactRequests/ignore';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../../src/actions/pine/contactRequests/removeIncoming', () => ({
  removeIncoming: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST).toBe('CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST');
  });
});

describe('CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS).toBe('CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS');
  });
});

describe('CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE).toBe('CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE');
  });
});

describe('ignore', () => {
  let contact;

  beforeEach(() => {
    contact = {
      contactRequest: {
        id: '0ca7e4b8-f5cb-4d74-96fe-10523d9b88bc',
        from: 'from@localhost'
      }
    };

    dispatchMock.mockClear();
    removeIncomingContactRequest.mockClear();
  });

  it('is a function', () => {
    expect(typeof ignoreContactRequest).toBe('function');
  });

  it('ignores one argument', () => {
    expect(ignoreContactRequest.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = ignoreContactRequest(contact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = ignoreContactRequest(contact);
    });

    it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST
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

      it('removes contact request from Pine server', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(removeIncomingContactRequest).toHaveBeenCalledWith(contact.contactRequest.id);
        });
      });

      it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS with the contact', () => {
        expect.hasAssertions();

        return promise.then((passedContact) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS,
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
        // Make the function fail by returning a rejected promise from removeIncomingContactRequest().
        removeIncomingContactRequest.mockImplementationOnce(() => Promise.reject(
          new Error('bf390c75-9c43-4758-8f49-d97b95aa9e08')
        ));

        promise = ignoreContactRequest(contact)(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('bf390c75-9c43-4758-8f49-d97b95aa9e08');
        });
      });

      it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE,
            error
          });
        });
      });
    });
  });
});
