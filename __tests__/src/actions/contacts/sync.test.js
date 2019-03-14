import { save as saveContacts } from '../../../../src/actions/contacts/save';
import { get as getContacts } from '../../../../src/actions/pine/contacts/get';

import {
  sync as syncContacts,
  CONTACTS_SYNC_REQUEST,
  CONTACTS_SYNC_SUCCESS,
  CONTACTS_SYNC_FAILURE
} from '../../../../src/actions/contacts/sync';

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
        id: '3631c8a1-d2f9-430f-bd2e-44a889a31836',
        address: 'one@example.org',
        waitingForContactRequest: false
      },
      '326e0bcd-66db-45d9-b67c-c55d268362a6': {
        id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
        address: 'two@example.org',
        waitingForContactRequest: true,
        contactRequest: {
          id: 'e6925cc1-cb5b-4de7-b0a9-eb92a46dd76b',
          from: 'me@localhost',
          createdAt: 1
        }
      },
      '9dc70a72-dce0-4a06-a14f-22761fe403ab': {
        id: '9dc70a72-dce0-4a06-a14f-22761fe403ab',
        address: 'you@localhost',
        waitingForContactRequest: false,
        contactRequest: {
          id: '5f3e83a6-2ca4-4dd9-b3a4-3dc3b3018d0f',
          from: 'you@localhost',
          createdAt: 1
        }
      }
    }
  }
}));

jest.mock('../../../../src/actions/pine/contacts/get', () => ({
  get: jest.fn(() => Promise.resolve([
    {
      id: '3631c8a1-d2f9-430f-bd2e-44a889a31836',
      address: 'one@example.org',
      waitingForContactRequest: false
    },
    {
      id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
      address: 'two@example.org',
      waitingForContactRequest: false
    },
    {
      id: '9dc70a72-dce0-4a06-a14f-22761fe403ab',
      address: 'you@localhost',
      waitingForContactRequest: false
    },
    {
      id: '82a40c34-a747-49d1-9586-861fece87f6a',
      address: 'three@example.org',
      waitingForContactRequest: false
    }
  ]))
}));

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../src/pineApi/user/get', () => {
  return jest.fn(() => Promise.resolve({
    id: '85b022a6-09b6-4b9d-adb2-faf237f167d6'
  }));
});

describe('CONTACTS_SYNC_REQUEST', () => {
  it('equals "CONTACTS_SYNC_REQUEST"', () => {
    expect(CONTACTS_SYNC_REQUEST).toBe('CONTACTS_SYNC_REQUEST');
  });
});

describe('CONTACTS_SYNC_SUCCESS', () => {
  it('equals "CONTACTS_SYNC_SUCCESS"', () => {
    expect(CONTACTS_SYNC_SUCCESS).toBe('CONTACTS_SYNC_SUCCESS');
  });
});

describe('CONTACTS_SYNC_FAILURE', () => {
  it('equals "CONTACTS_SYNC_FAILURE"', () => {
    expect(CONTACTS_SYNC_FAILURE).toBe('CONTACTS_SYNC_FAILURE');
  });
});

describe('sync', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof syncContacts).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(syncContacts.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = syncContacts();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = syncContacts();
    });

    it('dispatches an action of type CONTACTS_SYNC_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_SYNC_REQUEST
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

      it('updates outgoing contact requests', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts).toEqual(expect.objectContaining({
            '326e0bcd-66db-45d9-b67c-c55d268362a6': {
              id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
              address: 'two@example.org',
              waitingForContactRequest: false,
              unread: true
            }
          }));
        });
      });

      it('adds new contacts', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts).toEqual(expect.objectContaining({
            '82a40c34-a747-49d1-9586-861fece87f6a': expect.objectContaining({
              id: '82a40c34-a747-49d1-9586-861fece87f6a',
              address: 'three@example.org',
              waitingForContactRequest: false
            })
          }));
        });
      });

      it('dispatches an action of type CONTACTS_SYNC_SUCCESS with the synced contacts', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_SYNC_SUCCESS,
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
        // Make the function fail by returning a rejected promise from getContacts().
        getContacts.mockImplementationOnce(() => Promise.reject(
          new Error('65b549cf-bd06-438f-99a6-45dd20be8ca9')
        ));

        promise = syncContacts()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('65b549cf-bd06-438f-99a6-45dd20be8ca9');
        });
      });

      it('dispatches an action of type CONTACTS_SYNC_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_SYNC_FAILURE,
            error
          });
        });
      });
    });
  });
});
