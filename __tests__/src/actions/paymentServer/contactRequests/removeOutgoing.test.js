import removeOutgoingContactRequest from '../../../../../src/clients/paymentServer/user/contactRequests/removeOutgoing';

import {
  removeOutgoing as removeOutgoingContactRequestAction,
  PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST,
  PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS,
  PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE
} from '../../../../../src/actions/paymentServer/contactRequests/removeOutgoing';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  pine: {
    credentials: {
      userId: 'ec003e26-8ef2-4344-9c1c-649751242b31'
    }
  }
}));

jest.mock('../../../../../src/clients/paymentServer/user/contactRequests/removeOutgoing', () => {
  return jest.fn(() => Promise.resolve());
});

describe('PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST', () => {
  it('equals "PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST"', () => {
    expect(PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST).toBe('PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST');
  });
});

describe('PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS', () => {
  it('equals "PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS"', () => {
    expect(PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS).toBe('PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS');
  });
});

describe('PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE', () => {
  it('equals "PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE"', () => {
    expect(PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE).toBe('PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE');
  });
});

describe('removeOutgoing', () => {
  let contactRequest;

  beforeEach(() => {
    contactRequest = {
      id: 'd0bc690d-e106-4eb5-b813-454faf17e9bc',
      to: 'testing@localhost',
      toUserId: 'dfa76a5c-b269-4126-b13e-960caf7c0e8c'
    };

    removeOutgoingContactRequest.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeOutgoingContactRequestAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = removeOutgoingContactRequestAction(contactRequest);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = removeOutgoingContactRequestAction(contactRequest);
    });

    it('dispatches an action of type PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST
      });
    });

    it('removes the contact request with the contact request ID and credentials from state', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(removeOutgoingContactRequest).toHaveBeenCalled();

        expect(removeOutgoingContactRequest).toHaveBeenCalledWith(
          contactRequest,
          {
            userId: 'ec003e26-8ef2-4344-9c1c-649751242b31'
          }
        );
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

      it('dispatches an action of type PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from removeOutgoingContactRequest().
        removeOutgoingContactRequest.mockImplementationOnce(() => Promise.reject(
          new Error('a767446e-fd38-466e-9e0f-b0ff2d5eb969')
        ));

        promise = removeOutgoingContactRequestAction(contactRequest)(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE,
            error: expect.objectContaining({
              message: 'a767446e-fd38-466e-9e0f-b0ff2d5eb969'
            })
          });
        });
      });
    });
  });
});
