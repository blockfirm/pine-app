import removeContact from '../../../../../src/pineApi/user/contacts/remove';

import {
  remove as removeContactAction,
  PINE_CONTACTS_REMOVE_REQUEST,
  PINE_CONTACTS_REMOVE_SUCCESS,
  PINE_CONTACTS_REMOVE_FAILURE
} from '../../../../../src/actions/pine/contacts/remove';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  pine: {
    credentials: {
      userId: 'ec003e26-8ef2-4344-9c1c-649751242b31'
    }
  }
}));

jest.mock('../../../../../src/pineApi/user/contacts/remove', () => {
  return jest.fn(() => Promise.resolve());
});

describe('PINE_CONTACTS_REMOVE_REQUEST', () => {
  it('equals "PINE_CONTACTS_REMOVE_REQUEST"', () => {
    expect(PINE_CONTACTS_REMOVE_REQUEST).toBe('PINE_CONTACTS_REMOVE_REQUEST');
  });
});

describe('PINE_CONTACTS_REMOVE_SUCCESS', () => {
  it('equals "PINE_CONTACTS_REMOVE_SUCCESS"', () => {
    expect(PINE_CONTACTS_REMOVE_SUCCESS).toBe('PINE_CONTACTS_REMOVE_SUCCESS');
  });
});

describe('PINE_CONTACTS_REMOVE_FAILURE', () => {
  it('equals "PINE_CONTACTS_REMOVE_FAILURE"', () => {
    expect(PINE_CONTACTS_REMOVE_FAILURE).toBe('PINE_CONTACTS_REMOVE_FAILURE');
  });
});

describe('remove', () => {
  let contact;

  beforeEach(() => {
    contact = {
      id: '67d14202-4848-4178-b3b5-36631009d6a4'
    };

    removeContact.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeContactAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = removeContactAction(contact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = removeContactAction(contact);
    });

    it('dispatches an action of type PINE_CONTACTS_REMOVE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_CONTACTS_REMOVE_REQUEST
      });
    });

    it('removes the contact from user using the passed contact ID and credentials from state', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(removeContact).toHaveBeenCalled();

        expect(removeContact).toHaveBeenCalledWith(contact.id, {
          userId: 'ec003e26-8ef2-4344-9c1c-649751242b31'
        });
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CONTACTS_REMOVE_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACTS_REMOVE_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from removeContact().
        removeContact.mockImplementationOnce(() => Promise.reject(
          new Error('3a9a514d-835b-46bd-87c7-5adc777e9bc8')
        ));

        promise = removeContactAction(contact)(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CONTACTS_REMOVE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACTS_REMOVE_FAILURE,
            error: expect.objectContaining({
              message: '3a9a514d-835b-46bd-87c7-5adc777e9bc8'
            })
          });
        });
      });
    });
  });
});
