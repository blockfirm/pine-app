import setAvatar from '../../../../../src/pineApi/user/avatar/set';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    checksum: '3b03a548-6ffd-4eff-ac63-ff278557a8d4'
  })
}));

describe('set', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof setAvatar).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(setAvatar.length).toBe(2);
  });

  describe('when uploading an avatar for address "timothy@pine.cash"', () => {
    let image;
    let credentials;

    beforeEach(() => {
      image = '0bff3104-87af-4c2a-8864-bae2e384bc7a';

      credentials = {
        address: 'timothy@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      setAvatar(image, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://pine-payment-server.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/avatar', () => {
        const expectedUrl = 'https://pine-payment-server.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/avatar';
        expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.anything());
      });

      describe('the request options', () => {
        let options;

        beforeEach(() => {
          options = fetch.mock.calls[0][1];
        });

        it('is an object', () => {
          expect(typeof options).toBe('object');
          expect(options).toBeTruthy();
        });

        it('has "method" set to "PUT"', () => {
          expect(options.method).toBe('PUT');
        });

        it('has header "Content-Type" set to "application/json"', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Content-Type']).toBe('application/json');
        });

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOkgzNG40dEFnZFRBTHVQWW5QVkVPengrZGtGdU1UQTkwb0pNRUI0NmszMnFjVUlhd1BQbkJUbkpZcThjaDlwVU9URllxOHFSa21YRUgzUGZnTExMQlExRT0=');
        });

        describe('the body', () => {
          it('is a JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has image set to the passed image', () => {
            const body = JSON.parse(options.body);
            expect(body.image).toBe('0bff3104-87af-4c2a-8864-bae2e384bc7a');
          });
        });
      });
    });

    describe('when the response is missing a checksum', () => {
      beforeEach(() => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));
      });

      it('rejects the returned promise with an error', () => {
        expect.hasAssertions();

        return setAvatar(image, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Unknown error');
        });
      });
    });

    describe('when the response is an error', () => {
      beforeEach(() => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'c2c6032b-ac10-4105-b5ad-3fa44b4dc834'
          })
        }));
      });

      it('rejects the returned promise with the error message from the response', () => {
        expect.hasAssertions();

        return setAvatar(image, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('c2c6032b-ac10-4105-b5ad-3fa44b4dc834');
        });
      });
    });
  });
});
