import { save as saveContacts } from '../../../../src/actions/contacts/save';

import {
  markAsRead,
  CONTACTS_MARK_AS_READ
} from '../../../../src/actions/contacts/markAsRead';

const dispatchMock = jest.fn();

jest.mock('../../../../src/actions/contacts/save', () => ({
  save: jest.fn(() => Promise.resolve())
}));

describe('CONTACTS_MARK_AS_READ', () => {
  it('equals "CONTACTS_MARK_AS_READ"', () => {
    expect(CONTACTS_MARK_AS_READ).toBe('CONTACTS_MARK_AS_READ');
  });
});

describe('markAsRead', () => {
  let contact;

  beforeEach(() => {
    dispatchMock.mockClear();
    saveContacts.mockClear();

    contact = {
      id: 'e6d03b56-4e22-4e5f-8f0d-c1a78ddd799a',
      unread: true
    };
  });

  it('is a function', () => {
    expect(typeof markAsRead).toBe('function');
  });

  it('accepts one argument', () => {
    expect(markAsRead.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = markAsRead(contact);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = markAsRead(contact);
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

      it('dispatches an action of type CONTACTS_MARK_AS_READ with the passed contact', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: CONTACTS_MARK_AS_READ,
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

    describe('when it already is marked as read', () => {
      it('does not dispatch the CONTACTS_MARK_AS_READ action', () => {
        expect.hasAssertions();

        const readContact = {
          id: 'f16ea205-e93a-4ece-8533-71ec3874ba47',
          unread: false
        };

        return markAsRead(readContact)(dispatchMock).then(() => {
          expect(dispatchMock).not.toHaveBeenCalled();
        });
      });
    });
  });
});
