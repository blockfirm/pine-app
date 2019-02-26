import {
  remove as removeContact,
  CONTACTS_REMOVE_REQUEST,
  CONTACTS_REMOVE_SUCCESS,
  CONTACTS_REMOVE_FAILURE
} from '../../../../src/actions/contacts/remove';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_REMOVE_REQUEST', () => {
  it('equals "CONTACTS_REMOVE_REQUEST"', () => {
    expect(CONTACTS_REMOVE_REQUEST).toBe('CONTACTS_REMOVE_REQUEST');
  });
});

describe('CONTACTS_REMOVE_SUCCESS', () => {
  it('equals "CONTACTS_REMOVE_SUCCESS"', () => {
    expect(CONTACTS_REMOVE_SUCCESS).toBe('CONTACTS_REMOVE_SUCCESS');
  });
});

describe('CONTACTS_REMOVE_FAILURE', () => {
  it('equals "CONTACTS_REMOVE_FAILURE"', () => {
    expect(CONTACTS_REMOVE_FAILURE).toBe('CONTACTS_REMOVE_FAILURE');
  });
});

describe('remove', () => {
  let fakeContact;

  beforeEach(() => {
    fakeContact = {
      id: '34a943ea-ca42-415c-9177-acf8023005b4'
    };
  });

  it('is a function', () => {
    expect(typeof removeContact).toBe('function');
  });

  it('accepts one argument', () => {
    expect(removeContact.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = removeContact(fakeContact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = removeContact(fakeContact);
    });

    it('dispatches an action of type CONTACTS_REMOVE_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_REMOVE_REQUEST
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

      it('dispatches an action of type CONTACTS_REMOVE_SUCCESS with the contact', () => {
        expect.hasAssertions();

        return promise.then((contact) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_REMOVE_SUCCESS,
            contact
          });
        });
      });

      it('resolves to the removed contact', () => {
        expect.hasAssertions();

        return promise.then((contact) => {
          expect(contact).toEqual(expect.objectContaining(fakeContact));
        });
      });
    });
  });

  describe('when contact.id is undefined', () => {
    let promise;

    beforeEach(() => {
      fakeContact.id = undefined;
      promise = removeContact(fakeContact)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown contact.');
      });
    });

    it('dispatches an action of type CONTACTS_REMOVE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: CONTACTS_REMOVE_FAILURE,
          error
        });
      });
    });
  });

  describe('when contact is undefined', () => {
    let promise;

    beforeEach(() => {
      fakeContact = undefined;
      promise = removeContact(fakeContact)(dispatchMock);
    });

    it('rejects the returned promise', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('Unknown contact.');
      });
    });

    it('dispatches an action of type CONTACTS_REMOVE_FAILURE with the error', () => {
      expect.hasAssertions();

      return promise.catch((error) => {
        expect(error).toBeTruthy();

        expect(dispatchMock).toHaveBeenCalledWith({
          type: CONTACTS_REMOVE_FAILURE,
          error
        });
      });
    });
  });
});
