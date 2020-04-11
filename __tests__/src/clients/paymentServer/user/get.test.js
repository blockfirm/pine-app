import getUser from '../../../../../src/clients/paymentServer/user/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([{
    id: '6f9ec449-269a-4b4f-aa79-732259b1f316',
    username: 'timothy'
  }])
}));

describe('get', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof getUser).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getUser.length).toBe(1);
  });

  describe('when getting user with address "timothy@pine.cash"', () => {
    let address;
    let returnedPromise;

    beforeEach(() => {
      address = 'timothy@pine.cash';
      returnedPromise = getUser(address);
    });

    it('returns a promise', () => {
      expect(returnedPromise).toBeInstanceOf(Promise);
    });

    it('resolves to a user returned in the response', () => {
      expect.hasAssertions();

      return returnedPromise.then((user) => {
        expect(typeof user).toBe('object');

        // These values has been mocked at the top.
        expect(user.id).toBe('6f9ec449-269a-4b4f-aa79-732259b1f316');
        expect(user.username).toBe('timothy');
      });
    });

    describe('the HTTP request', () => {
      it('is made to the url https://pine-payment-server.pine.cash/v1/users?username=timothy', () => {
        const expectedUrl = 'https://pine-payment-server.pine.cash/v1/users?username=timothy';
        expect(fetch).toHaveBeenCalledWith(expectedUrl, undefined);
      });
    });

    describe('when the response is not an array', () => {
      it('rejects the returned promise with an error', () => {
        expect.hasAssertions();

        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        return getUser(address).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('invalid response');
        });
      });
    });

    describe('when the response is an empty array', () => {
      it('rejects the returned promise with an error', () => {
        expect.hasAssertions();

        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        }));

        return getUser(address).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('invalid response');
        });
      });
    });

    describe('when the response is missing an id', () => {
      it('rejects the returned promise with an error', () => {
        expect.hasAssertions();

        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{}])
        }));

        return getUser(address).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('invalid response');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        expect.hasAssertions();

        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'ac094566-7887-48e4-9e67-4173a47e7241'
          })
        }));

        return getUser(address).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('ac094566-7887-48e4-9e67-4173a47e7241');
        });
      });
    });
  });
});
