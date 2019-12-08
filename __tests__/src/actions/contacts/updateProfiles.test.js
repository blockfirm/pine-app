import getUser from '../../../../src/clients/paymentServer/user/get';
import { save as saveContacts } from '../../../../src/actions/contacts/save';

import {
  updateProfiles,
  CONTACTS_UPDATE_PROFILES_REQUEST,
  CONTACTS_UPDATE_PROFILES_SUCCESS,
  CONTACTS_UPDATE_PROFILES_FAILURE
} from '../../../../src/actions/contacts/updateProfiles';

const realDateNow = global.Date.now;

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
        displayName: 'One',
        avatar: {
          checksum: '833a8980-867f-4f2e-93ea-7e37b45de940'
        },
        createdAt: 1
      },
      '326e0bcd-66db-45d9-b67c-c55d268362a6': {
        id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
        address: 'two@example.org',
        displayName: 'Two',
        avatar: {
          checksum: null
        },
        createdAt: 60
      },
      '9dc70a72-dce0-4a06-a14f-22761fe403ab': {
        id: '9dc70a72-dce0-4a06-a14f-22761fe403ab',
        address: 'you@localhost',
        displayName: 'You',
        createdAt: 2,
        updatedAt: 50
      }
    }
  }
}));

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../../src/clients/paymentServer/user/get', () => {
  return jest.fn(() => Promise.resolve({
    id: '85b022a6-09b6-4b9d-adb2-faf237f167d6',
    displayName: '1eccf216-e9b6-4cc8-acf4-e7941d4be6c4',
    avatar: {
      checksum: '6c98c5ba-122a-4e76-81f6-453e375fe571'
    }
  }));
});

describe('CONTACTS_UPDATE_PROFILES_REQUEST', () => {
  it('equals "CONTACTS_UPDATE_PROFILES_REQUEST"', () => {
    expect(CONTACTS_UPDATE_PROFILES_REQUEST).toBe('CONTACTS_UPDATE_PROFILES_REQUEST');
  });
});

describe('CONTACTS_UPDATE_PROFILES_SUCCESS', () => {
  it('equals "CONTACTS_UPDATE_PROFILES_SUCCESS"', () => {
    expect(CONTACTS_UPDATE_PROFILES_SUCCESS).toBe('CONTACTS_UPDATE_PROFILES_SUCCESS');
  });
});

describe('CONTACTS_UPDATE_PROFILES_FAILURE', () => {
  it('equals "CONTACTS_UPDATE_PROFILES_FAILURE"', () => {
    expect(CONTACTS_UPDATE_PROFILES_FAILURE).toBe('CONTACTS_UPDATE_PROFILES_FAILURE');
  });
});

describe('updateProfiles', () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() => 70 * 1000);
  });

  afterAll(() => {
    global.Date.now = realDateNow;
  });

  beforeEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
    saveContacts.mockClear();
    getUser.mockClear();
  });

  it('is a function', () => {
    expect(typeof updateProfiles).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(updateProfiles.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = updateProfiles();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = updateProfiles();
    });

    it('dispatches an action of type CONTACTS_UPDATE_PROFILES_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_UPDATE_PROFILES_REQUEST
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

      it('updates contact profiles', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(contacts).toEqual({
            '3631c8a1-d2f9-430f-bd2e-44a889a31836': {
              id: '3631c8a1-d2f9-430f-bd2e-44a889a31836',
              address: 'one@example.org',
              displayName: '1eccf216-e9b6-4cc8-acf4-e7941d4be6c4',
              avatar: {
                checksum: '6c98c5ba-122a-4e76-81f6-453e375fe571'
              },
              createdAt: 1,
              updatedAt: 70
            },
            '326e0bcd-66db-45d9-b67c-c55d268362a6': {
              id: '326e0bcd-66db-45d9-b67c-c55d268362a6',
              address: 'two@example.org',
              displayName: 'Two',
              avatar: {
                checksum: null
              },
              createdAt: 60
            },
            '9dc70a72-dce0-4a06-a14f-22761fe403ab': {
              id: '9dc70a72-dce0-4a06-a14f-22761fe403ab',
              address: 'you@localhost',
              displayName: 'You',
              createdAt: 2,
              updatedAt: 50
            }
          });
        });
      });

      it('dispatches an action of type CONTACTS_UPDATE_PROFILES_SUCCESS with the updated contacts', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_UPDATE_PROFILES_SUCCESS,
            contacts
          });
        });
      });

      describe('when some contact profiles were updated', () => {
        it('saves the state', () => {
          expect.hasAssertions();

          return promise.then(() => {
            expect(saveContacts).toHaveBeenCalled();
          });
        });
      });

      describe('when no contact profiles were updated', () => {
        it('does not save the state', () => {
          expect.hasAssertions();

          // By mocking the time to be 50, all contacts will be too fresh to be updated.
          global.Date.now.mockImplementationOnce(() => 50);

          return updateProfiles()(dispatchMock, getStateMock).then(() => {
            expect(saveContacts).not.toHaveBeenCalled();
          });
        });
      });

      describe('when it fails to get a contact profile', () => {
        it('ignores the error', () => {
          expect.hasAssertions();
          getUser.mockImplementationOnce(() => Promise.reject(new Error()));

          return updateProfiles()(dispatchMock, getStateMock).then(() => {
            expect(getUser).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
