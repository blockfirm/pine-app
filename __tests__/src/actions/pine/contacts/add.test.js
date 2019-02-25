import addContact from '../../../../../src/PinePaymentProtocol/user/contacts/add';

import {
  add as addContactAction,
  PINE_CONTACTS_ADD_REQUEST,
  PINE_CONTACTS_ADD_SUCCESS,
  PINE_CONTACTS_ADD_FAILURE
} from '../../../../../src/actions/pine/contacts/add';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    user: {
      profile: {
        pineAddress: 'bb589666-7b43-4e44-be13-9fd76ec3f512'
      }
    }
  },
  keys: {
    items: {
      '1d12cf83-bf56-484c-9b57-425571013d27': {
        id: '1d12cf83-bf56-484c-9b57-425571013d27'
      }
    }
  }
}));

jest.mock('../../../../../src/PinePaymentProtocol/user/contacts/add', () => {
  return jest.fn(() => Promise.resolve({
    id: '85fd51d7-f18d-4bd7-ad36-d8359d7aafd8'
  }));
});

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('c6f19f52-924d-498f-9549-1c65c5bfaa7b'));
});

describe('PINE_CONTACTS_ADD_REQUEST', () => {
  it('equals "PINE_CONTACTS_ADD_REQUEST"', () => {
    expect(PINE_CONTACTS_ADD_REQUEST).toBe('PINE_CONTACTS_ADD_REQUEST');
  });
});

describe('PINE_CONTACTS_ADD_SUCCESS', () => {
  it('equals "PINE_CONTACTS_ADD_SUCCESS"', () => {
    expect(PINE_CONTACTS_ADD_SUCCESS).toBe('PINE_CONTACTS_ADD_SUCCESS');
  });
});

describe('PINE_CONTACTS_ADD_FAILURE', () => {
  it('equals "PINE_CONTACTS_ADD_FAILURE"', () => {
    expect(PINE_CONTACTS_ADD_FAILURE).toBe('PINE_CONTACTS_ADD_FAILURE');
  });
});

describe('add', () => {
  let address;

  beforeEach(() => {
    address = 'cfc05050-3371-4e12-be2d-10b54a4ad841';
    addContact.mockClear();
  });

  it('is a function', () => {
    expect(typeof addContactAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = addContactAction(address);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = addContactAction(address);
    });

    it('dispatches an action of type PINE_CONTACTS_ADD_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_CONTACTS_ADD_REQUEST
      });
    });

    it('adds contact to user using its address and mnemonic', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedPineAddress = 'bb589666-7b43-4e44-be13-9fd76ec3f512';
        const expectedContactAddress = 'cfc05050-3371-4e12-be2d-10b54a4ad841';
        const expectedMnemonic = 'c6f19f52-924d-498f-9549-1c65c5bfaa7b';

        expect(addContact).toHaveBeenCalled();
        expect(addContact).toHaveBeenCalledWith(expectedPineAddress, expectedContactAddress, expectedMnemonic);
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

      it('dispatches an action of type PINE_CONTACTS_ADD_SUCCESS with the contact', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACTS_ADD_SUCCESS,
            contact: expect.objectContaining({
              id: '85fd51d7-f18d-4bd7-ad36-d8359d7aafd8'
            })
          });
        });
      });

      it('resolves to the added contact', () => {
        expect.hasAssertions();

        return promise.then((contact) => {
          expect(contact).toEqual(expect.objectContaining({
            id: '85fd51d7-f18d-4bd7-ad36-d8359d7aafd8'
          }));
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from addContact().
        addContact.mockImplementationOnce(() => Promise.reject(
          new Error('99da140c-3e65-4e4e-9358-7230b898988b')
        ));

        promise = addContactAction(address)(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CONTACTS_ADD_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACTS_ADD_FAILURE,
            error: expect.objectContaining({
              message: '99da140c-3e65-4e4e-9358-7230b898988b'
            })
          });
        });
      });
    });
  });
});
