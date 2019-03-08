import { save as saveContacts } from '../../../../../src/actions/contacts/save';
import { get as getContactRequests } from '../../../../../src/actions/pine/contactRequests/get';

import {
  syncIncoming as syncIncomingContactRequests,
  CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST,
  CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS,
  CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE
} from '../../../../../src/actions/contacts/contactRequests/syncIncoming';

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn(), () => ({}));
  }

  return action;
});

const getStateMock = jest.fn(() => ({
  settings: {
    user: {
      profile: {
        address: 'me@localhost'
      }
    }
  },
  contacts: {
    items: {
      '3631c8a1-d2f9-430f-bd2e-44a889a31836': {
        id: '3631c8a1-d2f9-430f-bd2e-44a889a31836'
      },
      '326e0bcd-66db-45d9-b67c-c55d268362a6': {
        id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
        contactRequest: {
          id: 'e6925cc1-cb5b-4de7-b0a9-eb92a46dd76b',
          from: 'me@localhost',
          createdAt: 1
        }
      },
      '9dc70a72-dce0-4a06-a14f-22761fe403ab': {
        id: '9dc70a72-dce0-4a06-a14f-22761fe403ab',
        contactRequest: {
          id: '5f3e83a6-2ca4-4dd9-b3a4-3dc3b3018d0f',
          from: 'you@localhost',
          createdAt: 1
        }
      },
      'd403dc44-bb86-4fc9-be43-ff4154155f3d': {
        id: 'd403dc44-bb86-4fc9-be43-ff4154155f3d',
        contactRequest: {
          id: '6f6e0376-13ee-4ff3-9ff2-7c69b7e4a084',
          from: 'someone@localhost',
          createdAt: 2
        }
      }
    }
  }
}));

jest.mock('../../../../../src/actions/pine/contactRequests/get', () => ({
  get: jest.fn(() => Promise.resolve([
    {
      id: '7954d4d4-6674-4e56-af4c-f507e12fcdd3',
      from: 'someone@localhost',
      createdAt: 3
    },
    {
      id: 'fe9d4c6b-f13d-402a-80f2-b462ab76ac23',
      from: 'new@localhost',
      createdAt: 4
    }
  ]))
}));

jest.mock('../../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../../src/PinePaymentProtocol/user/get', () => {
  return jest.fn(() => Promise.resolve({
    id: '85b022a6-09b6-4b9d-adb2-faf237f167d6'
  }));
});

jest.mock('uuid/v4', () => {
  return jest.fn(() => '4ef212b3-cc8f-4f13-a479-7c2fb324c3d0');
});

describe('CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST).toBe('CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST');
  });
});

describe('CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS).toBe('CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS');
  });
});

describe('CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE', () => {
  it('equals "CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE"', () => {
    expect(CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE).toBe('CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE');
  });
});

describe('syncIncoming', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof syncIncomingContactRequests).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(syncIncomingContactRequests.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = syncIncomingContactRequests();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = syncIncomingContactRequests();
    });

    it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST
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

      it('keeps contacts without contact requests', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts).toEqual(expect.objectContaining({
            '3631c8a1-d2f9-430f-bd2e-44a889a31836': {
              id: '3631c8a1-d2f9-430f-bd2e-44a889a31836'
            }
          }));
        });
      });

      it('keeps outgoing contact requests', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts).toEqual(expect.objectContaining({
            '326e0bcd-66db-45d9-b67c-c55d268362a6': {
              id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
              contactRequest: {
                id: 'e6925cc1-cb5b-4de7-b0a9-eb92a46dd76b',
                from: 'me@localhost',
                createdAt: 1
              }
            }
          }));
        });
      });

      it('removes old incoming contact requests', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts['9dc70a72-dce0-4a06-a14f-22761fe403ab']).toBeUndefined();
        });
      });

      it('updates updated incoming contact requests', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts).toEqual(expect.objectContaining({
            'd403dc44-bb86-4fc9-be43-ff4154155f3d': {
              id: 'd403dc44-bb86-4fc9-be43-ff4154155f3d',
              contactRequest: {
                id: '7954d4d4-6674-4e56-af4c-f507e12fcdd3',
                from: 'someone@localhost',
                createdAt: 3
              }
            }
          }));
        });
      });

      it('adds new contact requests as contacts', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts).toEqual(expect.objectContaining({
            '4ef212b3-cc8f-4f13-a479-7c2fb324c3d0': expect.objectContaining({
              id: '4ef212b3-cc8f-4f13-a479-7c2fb324c3d0',
              userId: '85b022a6-09b6-4b9d-adb2-faf237f167d6',
              address: 'new@localhost',
              contactRequest: {
                id: 'fe9d4c6b-f13d-402a-80f2-b462ab76ac23',
                from: 'new@localhost',
                createdAt: 4
              }
            })
          }));
        });
      });

      it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS with the synced contacts', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_SUCCESS,
            contacts
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
        // Make the function fail by returning a rejected promise from getContactRequests().
        getContactRequests.mockImplementationOnce(() => Promise.reject(
          new Error('65b549cf-bd06-438f-99a6-45dd20be8ca9')
        ));

        promise = syncIncomingContactRequests()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('65b549cf-bd06-438f-99a6-45dd20be8ca9');
        });
      });

      it('dispatches an action of type CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE,
            error
          });
        });
      });
    });
  });
});
