import getContactRequests from '../../../../../src/pineApi/user/contactRequests/get';

import {
  get as getContactRequestAction,
  PINE_CONTACT_REQUESTS_GET_REQUEST,
  PINE_CONTACT_REQUESTS_GET_SUCCESS,
  PINE_CONTACT_REQUESTS_GET_FAILURE
} from '../../../../../src/actions/pine/contactRequests/get';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    user: {
      profile: {
        address: '7384fd3f-8c1b-4c7c-a21d-5edf8456648a'
      }
    }
  },
  keys: {
    items: {
      '98041209-a681-42ae-8b96-162890d5b7b7': {
        id: '98041209-a681-42ae-8b96-162890d5b7b7'
      }
    }
  }
}));

jest.mock('../../../../../src/pineApi/user/contactRequests/get', () => {
  return jest.fn(() => Promise.resolve([
    'f6e52d81-36b9-4ce5-9008-0b17a5efa43f'
  ]));
});

jest.mock('../../../../../src/crypto/getMnemonicByKey', () => {
  return jest.fn(() => Promise.resolve('06535332-01b0-43a0-bc11-6a2dbc88ff4b'));
});

describe('PINE_CONTACT_REQUESTS_GET_REQUEST', () => {
  it('equals "PINE_CONTACT_REQUESTS_GET_REQUEST"', () => {
    expect(PINE_CONTACT_REQUESTS_GET_REQUEST).toBe('PINE_CONTACT_REQUESTS_GET_REQUEST');
  });
});

describe('PINE_CONTACT_REQUESTS_GET_SUCCESS', () => {
  it('equals "PINE_CONTACT_REQUESTS_GET_SUCCESS"', () => {
    expect(PINE_CONTACT_REQUESTS_GET_SUCCESS).toBe('PINE_CONTACT_REQUESTS_GET_SUCCESS');
  });
});

describe('PINE_CONTACT_REQUESTS_GET_FAILURE', () => {
  it('equals "PINE_CONTACT_REQUESTS_GET_FAILURE"', () => {
    expect(PINE_CONTACT_REQUESTS_GET_FAILURE).toBe('PINE_CONTACT_REQUESTS_GET_FAILURE');
  });
});

describe('get', () => {
  beforeEach(() => {
    getContactRequests.mockClear();
  });

  it('is a function', () => {
    expect(typeof getContactRequestAction).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = getContactRequestAction();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getContactRequestAction();
    });

    it('dispatches an action of type PINE_CONTACT_REQUESTS_GET_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PINE_CONTACT_REQUESTS_GET_REQUEST
      });
    });

    it('gets contact requests using the user\'s address and mnemonic', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedPineAddress = '7384fd3f-8c1b-4c7c-a21d-5edf8456648a';
        const expectedMnemonic = '06535332-01b0-43a0-bc11-6a2dbc88ff4b';

        expect(getContactRequests).toHaveBeenCalled();

        expect(getContactRequests).toHaveBeenCalledWith({
          address: expectedPineAddress,
          mnemonic: expectedMnemonic
        });
      });
    });

    it('does not get contact requests if user does not have a Pine address', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          user: {
            profile: {}
          }
        },
        keys: {
          items: {}
        }
      }));

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(getContactRequests).toHaveBeenCalledTimes(0);
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

      it('dispatches an action of type PINE_CONTACT_REQUESTS_GET_SUCCESS with the contact requests', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_GET_SUCCESS,
            contactRequests: expect.arrayContaining([
              'f6e52d81-36b9-4ce5-9008-0b17a5efa43f'
            ])
          });
        });
      });

      it('resolves to the contact requests', () => {
        expect.hasAssertions();

        return promise.then((contactRequests) => {
          expect(contactRequests).toEqual(expect.arrayContaining([
            'f6e52d81-36b9-4ce5-9008-0b17a5efa43f'
          ]));
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from getContactRequests().
        getContactRequests.mockImplementationOnce(() => Promise.reject(
          new Error('316614bb-1630-4160-8c2d-1148c70478b0')
        ));

        promise = getContactRequestAction()(dispatchMock, getStateMock);
      });

      it('dispatches an action of type PINE_CONTACT_REQUESTS_GET_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: PINE_CONTACT_REQUESTS_GET_FAILURE,
            error: expect.objectContaining({
              message: '316614bb-1630-4160-8c2d-1148c70478b0'
            })
          });
        });
      });
    });
  });
});
