import getUserById from '../../../../../src/clients/paymentServer/user/getById';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: 'AH3zqC5iaYyKdmPyZmwgjiHM1hwttxNGr',
    username: 'timothy'
  })
}));

describe('getById', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof getUserById).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getUserById.length).toBe(2);
  });

  describe('when getting user with id "AH3zqC5iaYyKdmPyZmwgjiHM1hwttxNGr" from host "pine.cash"', () => {
    let userId;
    let hostname;
    let returnedPromise;

    beforeEach(() => {
      userId = 'AH3zqC5iaYyKdmPyZmwgjiHM1hwttxNGr';
      hostname = 'pine.cash';
      returnedPromise = getUserById(userId, hostname);
    });

    it('returns a promise', () => {
      expect(returnedPromise).toBeInstanceOf(Promise);
    });

    it('resolves to a user returned in the response', () => {
      expect.hasAssertions();

      return returnedPromise.then((user) => {
        expect(typeof user).toBe('object');

        // These values has been mocked at the top.
        expect(user.id).toBe('AH3zqC5iaYyKdmPyZmwgjiHM1hwttxNGr');
        expect(user.username).toBe('timothy');
      });
    });

    describe('the HTTP request', () => {
      it('is made to the url https://pine-payment-server.pine.cash/v1/users/AH3zqC5iaYyKdmPyZmwgjiHM1hwttxNGr', () => {
        const expectedUrl = 'https://pine-payment-server.pine.cash/v1/users/AH3zqC5iaYyKdmPyZmwgjiHM1hwttxNGr';
        expect(fetch).toHaveBeenCalledWith(expectedUrl);
      });
    });

    describe('when the response is missing an id', () => {
      it('rejects the returned promise with an error', () => {
        expect.hasAssertions();

        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        return getUserById(userId, hostname).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Unknown error');
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

        return getUserById(userId, hostname).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('ac094566-7887-48e4-9e67-4173a47e7241');
        });
      });
    });
  });
});
