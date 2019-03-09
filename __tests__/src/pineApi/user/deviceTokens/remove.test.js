import removeDeviceToken from '../../../../../src/pineApi/user/deviceTokens/remove';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: 'fbd0dfad-9907-4d2c-9bc0-3ae546502831'
  })
}));

describe('remove', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeDeviceToken).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(removeDeviceToken.length).toBe(2);
  });

  describe('when removing a device token', () => {
    let deviceTokenId;
    let credentials;

    beforeEach(() => {
      deviceTokenId = '68f353de-1142-4e26-9c4e-2d97d632afb7';

      credentials = {
        address: 'timothy@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      return removeDeviceToken(deviceTokenId, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/device-tokens/68f353de-1142-4e26-9c4e-2d97d632afb7', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/device-tokens/68f353de-1142-4e26-9c4e-2d97d632afb7';
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

        it('has "method" set to "DELETE"', () => {
          expect(options.method).toBe('DELETE');
        });

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOklOQWk1c0RzYjdhUDRTT3dIUWNacjZRazhCVFd5bnNoNEJ5KzZ5T2ZuTGtqYmo0WEE0eUVTNTJCMzBYTkhmSmFlTWEyUlFmemZEWUJvK0UwVXJCMC8xZz0=');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'fd268ab4-ca3c-4e29-b1fb-3637b86fee7f'
          })
        }));

        expect.hasAssertions();

        return removeDeviceToken(deviceTokenId, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('fd268ab4-ca3c-4e29-b1fb-3637b86fee7f');
        });
      });
    });
  });
});
