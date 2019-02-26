import { AsyncStorage } from 'react-native';

import {
  save as saveContacts,
  CONTACTS_SAVE_REQUEST,
  CONTACTS_SAVE_SUCCESS,
  CONTACTS_SAVE_FAILURE
} from '../../../../src/actions/contacts/save';

const CONTACTS_STORAGE_KEY = '@Contacts';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  contacts: {
    items: {
      '3631c8a1-d2f9-430f-bd2e-44a889a31836': {
        id: '3631c8a1-d2f9-430f-bd2e-44a889a31836'
      },
      '326e0bcd-66db-45d9-b67c-c55d268362a6': {
        id: '326e0bcd-66db-45d9-b67c-c55d268362a6'
      }
    }
  }
}));

jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn(() => Promise.resolve())
  }
}));

describe('CONTACTS_SAVE_REQUEST', () => {
  it('equals "CONTACTS_SAVE_REQUEST"', () => {
    expect(CONTACTS_SAVE_REQUEST).toBe('CONTACTS_SAVE_REQUEST');
  });
});

describe('CONTACTS_SAVE_SUCCESS', () => {
  it('equals "CONTACTS_SAVE_SUCCESS"', () => {
    expect(CONTACTS_SAVE_SUCCESS).toBe('CONTACTS_SAVE_SUCCESS');
  });
});

describe('CONTACTS_SAVE_FAILURE', () => {
  it('equals "CONTACTS_SAVE_FAILURE"', () => {
    expect(CONTACTS_SAVE_FAILURE).toBe('CONTACTS_SAVE_FAILURE');
  });
});

describe('save', () => {
  beforeEach(() => {
    AsyncStorage.setItem.mockClear();
    dispatchMock.mockClear();
    getStateMock.mockClear();
  });

  it('is a function', () => {
    expect(typeof saveContacts).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(saveContacts.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = saveContacts();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = saveContacts();
    });

    it('dispatches an action of type CONTACTS_SAVE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CONTACTS_SAVE_REQUEST
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

      it('calls getState() to get the contacts from the state', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(getStateMock).toHaveBeenCalledTimes(1);
        });
      });

      it('serializes the contacts and saves it to AsyncStorage', () => {
        expect.hasAssertions();

        return promise.then(() => {
          const argument1 = AsyncStorage.setItem.mock.calls[0][0];
          const argument2 = AsyncStorage.setItem.mock.calls[0][1];
          const deserializedArgument2 = JSON.parse(argument2);

          expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
          expect(argument1).toBe(CONTACTS_STORAGE_KEY);

          expect(typeof deserializedArgument2).toBe('object');
          expect(deserializedArgument2['3631c8a1-d2f9-430f-bd2e-44a889a31836']).toBeTruthy();
          expect(deserializedArgument2['326e0bcd-66db-45d9-b67c-c55d268362a6']).toBeTruthy();
        });
      });

      it('dispatches an action of type CONTACTS_SAVE_SUCCESS', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_SAVE_SUCCESS
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from AsyncStorage.setItem().
        AsyncStorage.setItem.mockImplementationOnce(() => Promise.reject(
          new Error('52af7e8e-8812-4962-a43f-c73b4358a876')
        ));

        promise = saveContacts()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('52af7e8e-8812-4962-a43f-c73b4358a876');
        });
      });

      it('dispatches an action of type CONTACTS_SAVE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_SAVE_FAILURE,
            error
          });
        });
      });
    });
  });
});
