import removeIncomingContactRequest from '../../../../../src/clients/paymentServer/user/contactRequests/removeIncoming';

import {
  removeIncoming as removeIncomingContactRequestAction,
  PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST,
  PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS,
  PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE
} from '../../../../../src/actions/pine/contactRequests/removeIncoming';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  pine: {
    credentials: {
      userId: 'ec003e26-8ef2-4344-9c1c-649751242b31'
    }
  }
}));

jest.mock('../../../../../src/clients/paymentServer/user/contactRequests/removeIncoming', () => {
  return jest.fn(() => Promise.resolve());
});

describe('PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST', () => {
  it('equals "PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST"', () => {
    expect(PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST).toBe('PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST');
  });
});

describe('PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS', () => {
  it('equals "PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS"', () => {
    expect(PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS).toBe('PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS');
  });
});

describe('PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE', () => {
  it('equals "PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE"', () => {
    expect(PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE).toBe('PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE');
  });
});

describe('removeIncoming', () => {
  let contactRequestId;

  beforeEach(() => {
    contactRequestId = '46e8a0ff-15d0-419f-881c-a44b39158540';
    removeIncomingContactRequest.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeIncomingContactRequestAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = removeIncomingContactRequestAction(contactRequestId);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = removeIncomingContactRequestAction(contactRequestId);
    });

    it('dispatches an action of type PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST
      });
    });

    it('removes the contact request using the contactRequestId and credentials from state', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(removeIncomingContactRequest).toHaveBeenCalled();

        expect(removeIncomingContactRequest).toHaveBeenCalledWith(contactRequestId, {
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

      it('dispatches an action of type PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from removeIncomingContactRequest().
        removeIncomingContactRequest.mockImplementationOnce(() => Promise.reject(
          new Error('27ff11b1-5343-44fa-a782-0a8299e62de2')
        ));

        promise = removeIncomingContactRequestAction(contactRequestId)(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE,
            error: expect.objectContaining({
              message: '27ff11b1-5343-44fa-a782-0a8299e62de2'
            })
          });
        });
      });
    });
  });
});
