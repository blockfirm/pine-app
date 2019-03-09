import addDeviceToken from '../../../../../src/pineApi/user/deviceTokens/add';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: '518241de-1b7a-4df3-8c5b-98c0a13d1f5b'
  })
}));

describe('add', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof addDeviceToken).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(addDeviceToken.length).toBe(2);
  });

  describe('when adding a device token', () => {
    let deviceToken;
    let credentials;

    beforeEach(() => {
      deviceToken = { ios: 'fedce6e5-cff2-4c82-ba84-6d49834b6513' };

      credentials = {
        address: 'timothy@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      return addDeviceToken(deviceToken, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/device-tokens', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/device-tokens';
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

        it('has "method" set to "POST"', () => {
          expect(options.method).toBe('POST');
        });

        it('has header "Content-Type" set to "application/json"', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Content-Type']).toBe('application/json');
        });

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOklFOUVhOTBucFR5dTJqc29VY2JYdFVmd2E4bnU0ZzJzNjJRVGdaZDBvUlUrVHl5Z0VpeHQ1TmFPN0xjdXJvcDFnNlRxUjVyZnlRMUVRQXprM0Z1MFhHST0=');
        });

        describe('the body', () => {
          it('is a JSON string of the passed device token object', () => {
            const body = JSON.parse(options.body);
            expect(body).toMatchObject(deviceToken);
          });
        });
      });
    });

    describe('when the response is missing an id', () => {
      it('rejects the returned promise with an error', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        expect.hasAssertions();

        return addDeviceToken(deviceToken, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Unknown error');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: '4961f8d0-5309-4dd7-9115-8bf9c2dc67c7'
          })
        }));

        expect.hasAssertions();

        return addDeviceToken(deviceToken, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('4961f8d0-5309-4dd7-9115-8bf9c2dc67c7');
        });
      });
    });
  });
});
