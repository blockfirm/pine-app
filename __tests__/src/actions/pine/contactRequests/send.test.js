import createContactRequest from '../../../../../src/PinePaymentProtocol/user/contactRequests/create';

import {
  send as sendContactRequestAction,
  PINE_CONTACT_REQUESTS_SEND_REQUEST,
  PINE_CONTACT_REQUESTS_SEND_SUCCESS,
  PINE_CONTACT_REQUESTS_SEND_FAILURE
} from '../../../../../src/actions/pine/contactRequests/send';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    user: {
      profile: {
        pineAddress: '8990c4f4-5544-4f8f-aace-4570f69c8c0a'
      }
    }
  },
  keys: {
    items: {
      '8c4a857e-6874-4dcc-93bc-d9a8c97de5da': {
        id: '8c4a857e-6874-4dcc-93bc-d9a8c97de5da'
      }
    }
  }
}));

jest.mock('../../../../../src/PinePaymentProtocol/user/contactRequests/create', () => {
  return jest.fn(() => Promise.resolve({
    id: '5d0db54e-bfc9-4f67-a9e7-35b65406c5a0'
  }));
});

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('e04fe590-e615-4fa9-af22-bd8d14b2878c'));
});

describe('PINE_CONTACT_REQUESTS_SEND_REQUEST', () => {
  it('equals "PINE_CONTACT_REQUESTS_SEND_REQUEST"', () => {
    expect(PINE_CONTACT_REQUESTS_SEND_REQUEST).toBe('PINE_CONTACT_REQUESTS_SEND_REQUEST');
  });
});

describe('PINE_CONTACT_REQUESTS_SEND_SUCCESS', () => {
  it('equals "PINE_CONTACT_REQUESTS_SEND_SUCCESS"', () => {
    expect(PINE_CONTACT_REQUESTS_SEND_SUCCESS).toBe('PINE_CONTACT_REQUESTS_SEND_SUCCESS');
  });
});

describe('PINE_CONTACT_REQUESTS_SEND_FAILURE', () => {
  it('equals "PINE_CONTACT_REQUESTS_SEND_FAILURE"', () => {
    expect(PINE_CONTACT_REQUESTS_SEND_FAILURE).toBe('PINE_CONTACT_REQUESTS_SEND_FAILURE');
  });
});

describe('send', () => {
  let to;

  beforeEach(() => {
    to = 'e4f03e5d-4e13-44b8-a6e0-98679314f1cd';
    createContactRequest.mockClear();
  });

  it('is a function', () => {
    expect(typeof sendContactRequestAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = sendContactRequestAction(to);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = sendContactRequestAction(to);
    });

    it('dispatches an action of type PINE_CONTACT_REQUESTS_SEND_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_CONTACT_REQUESTS_SEND_REQUEST
      });
    });

    it('sends a contact request using the user\'s address and mnemonic', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedToAddress = 'e4f03e5d-4e13-44b8-a6e0-98679314f1cd';
        const expectedFromAddress = '8990c4f4-5544-4f8f-aace-4570f69c8c0a';
        const expectedMnemonic = 'e04fe590-e615-4fa9-af22-bd8d14b2878c';

        expect(createContactRequest).toHaveBeenCalled();
        expect(createContactRequest).toHaveBeenCalledWith(expectedToAddress, expectedFromAddress, expectedMnemonic);
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

      it('dispatches an action of type PINE_CONTACT_REQUESTS_SEND_SUCCESS with the contact that received the request', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_SEND_SUCCESS,
            contact: expect.objectContaining({
              id: '5d0db54e-bfc9-4f67-a9e7-35b65406c5a0'
            })
          });
        });
      });

      it('resolves to the contact that received the request', () => {
        expect.hasAssertions();

        return promise.then((contact) => {
          expect(contact).toEqual(expect.objectContaining({
            id: '5d0db54e-bfc9-4f67-a9e7-35b65406c5a0'
          }));
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from createContactRequest().
        createContactRequest.mockImplementationOnce(() => Promise.reject(
          new Error('13bae1a8-865e-4afe-b3be-d33749cf441c')
        ));

        promise = sendContactRequestAction(to)(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CONTACT_REQUESTS_SEND_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_SEND_FAILURE,
            error: expect.objectContaining({
              message: '13bae1a8-865e-4afe-b3be-d33749cf441c'
            })
          });
        });
      });
    });
  });
});
