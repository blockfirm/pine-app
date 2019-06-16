import AsyncStorage from '@react-native-community/async-storage';

import {
  load as loadContacts,
  CONTACTS_LOAD_REQUEST,
  CONTACTS_LOAD_SUCCESS,
  CONTACTS_LOAD_FAILURE
} from '../../../../src/actions/contacts/load';

const CONTACTS_STORAGE_KEY = '@Contacts';
const dispatchMock = jest.fn();

jest.mock('@react-native-community/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(
    '{ "id": "556152bc-9ae0-44c0-be59-4afca1c543c0" }'
  ))
}));

describe('CONTACTS_LOAD_REQUEST', () => {
  it('equals "CONTACTS_LOAD_REQUEST"', () => {
    expect(CONTACTS_LOAD_REQUEST).toBe('CONTACTS_LOAD_REQUEST');
  });
});

describe('CONTACTS_LOAD_SUCCESS', () => {
  it('equals "CONTACTS_LOAD_SUCCESS"', () => {
    expect(CONTACTS_LOAD_SUCCESS).toBe('CONTACTS_LOAD_SUCCESS');
  });
});

describe('CONTACTS_LOAD_FAILURE', () => {
  it('equals "CONTACTS_LOAD_FAILURE"', () => {
    expect(CONTACTS_LOAD_FAILURE).toBe('CONTACTS_LOAD_FAILURE');
  });
});

describe('load', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it('is a function', () => {
    expect(typeof loadContacts).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(loadContacts.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = loadContacts();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = loadContacts();
    });

    it('dispatches an action of type CONTACTS_LOAD_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_LOAD_REQUEST
      });
    });

    it('gets the contacts from AsyncStorage', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock).then(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(CONTACTS_STORAGE_KEY);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock);
      });

      it('dispatches an action of type CONTACTS_LOAD_SUCCESS with the contacts', () => {
        expect.hasAssertions();

        return promise.then((contacts) => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_LOAD_SUCCESS,
            contacts
          });
        });
      });

      describe('the resolved value', () => {
        let contacts;

        beforeEach(() => {
          return promise.then((result) => {
            contacts = result;
          });
        });

        it('is an object that is deserialized from AsyncStorage', () => {
          expect(typeof contacts).toBe('object');
          expect(contacts).toBeTruthy();

          // This value comes from the mock of AsyncStorage.getItem().
          expect(contacts.id).toBe('556152bc-9ae0-44c0-be59-4afca1c543c0');
        });
      });

      describe('when there are no contacts', () => {
        it('resolves to an empty object', () => {
          expect.hasAssertions();

          // Make the AsyncStorage.getItem() mock return a promise that resolves to null.
          AsyncStorage.getItem.mockImplementationOnce(() => Promise.resolve(null));

          return loadContacts()(dispatchMock).then((contacts) => {
            expect(contacts).toBeTruthy();
            expect(contacts).toMatchObject({});
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.getItem().
        AsyncStorage.getItem.mockImplementationOnce(() => Promise.reject(
          new Error('af99ccb7-eb6d-4d5d-a4d5-55aa93a71e2f')
        ));

        promise = loadContacts()(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('af99ccb7-eb6d-4d5d-a4d5-55aa93a71e2f');
        });
      });

      it('dispatches an action of type CONTACTS_LOAD_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_LOAD_FAILURE,
            error
          });
        });
      });
    });
  });
});
