import { save as saveContacts } from '../../../../src/actions/contacts/save';

import {
  markAsUnread,
  CONTACTS_MARK_AS_UNREAD
} from '../../../../src/actions/contacts/markAsUnread';

const dispatchMock = jest.fn();

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_MARK_AS_UNREAD', () => {
  it('equals "CONTACTS_MARK_AS_UNREAD"', () => {
    expect(CONTACTS_MARK_AS_UNREAD).toBe('CONTACTS_MARK_AS_UNREAD');
  });
});

describe('markAsUnread', () => {
  let contact;

  beforeEach(() => {
    dispatchMock.mockClear();
    saveContacts.mockClear();

    contact = {
      id: 'e5eb5e6e-8b0d-438b-b61d-4e504e1eff9d',
      unread: false
    };
  });

  it('is a function', () => {
    expect(typeof markAsUnread).toBe('function');
  });

  it('accepts one argument', () => {
    expect(markAsUnread.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = markAsUnread(contact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = markAsUnread(contact);
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

      it('dispatches an action of type CONTACTS_MARK_AS_UNREAD with the passed contact', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_MARK_AS_UNREAD,
            contact
          });
        });
      });

      it('saves the contacts', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(saveContacts).toHaveBeenCalled();
        });
      });
    });

    describe('when it already is marked as unread', () => {
      it('does not dispatch the CONTACTS_MARK_AS_UNREAD action', () => {
        expect.hasAssertions();

        const unreadContact = {
          id: '05e3e07f-5bf0-4c4f-8aa6-f1f2d8e78609',
          unread: true
        };

        return markAsUnread(unreadContact)(dispatchMock).then(() => {
          expect(dispatchMock).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the "persist" parameter is set to false', () => {
      it('does not save the contacts to persistent storage', () => {
        expect.hasAssertions();

        const persist = false;

        const fakeContact = {
          id: '9530f7d2-5f21-4737-a319-ccf19ac987d1',
          unread: true
        };

        return markAsUnread(fakeContact, persist)(dispatchMock).then(() => {
          expect(saveContacts).not.toHaveBeenCalled();
        });
      });
    });
  });
});
