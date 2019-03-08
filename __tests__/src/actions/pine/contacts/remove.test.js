import removeContact from '../../../../../src/PinePaymentProtocol/user/contacts/remove';

import {
  remove as removeContactAction,
  PINE_CONTACTS_REMOVE_REQUEST,
  PINE_CONTACTS_REMOVE_SUCCESS,
  PINE_CONTACTS_REMOVE_FAILURE
} from '../../../../../src/actions/pine/contacts/remove';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    user: {
      profile: {
        address: 'b7431570-b5f8-41c1-a079-26d9569f44ff'
      }
    }
  },
  keys: {
    items: {
      '56b1fb47-466f-4f45-a349-78ccd3c80f45': {
        id: '56b1fb47-466f-4f45-a349-78ccd3c80f45'
      }
    }
  }
}));

jest.mock('../../../../../src/PinePaymentProtocol/user/contacts/remove', () => {
  return jest.fn(() => Promise.resolve());
});

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('3f848306-c1cb-4ea8-85a9-8918683ac886'));
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

    it('removes the contact from user using the passed contact ID and user\'s address and mnemonic', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedPineAddress = 'b7431570-b5f8-41c1-a079-26d9569f44ff';
        const expectedMnemonic = '3f848306-c1cb-4ea8-85a9-8918683ac886';

        expect(removeContact).toHaveBeenCalled();
        expect(removeContact).toHaveBeenCalledWith(expectedPineAddress, contact.id, expectedMnemonic);
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
