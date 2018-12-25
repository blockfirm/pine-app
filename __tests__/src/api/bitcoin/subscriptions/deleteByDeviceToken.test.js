import deleteByDeviceToken from '../../../../../src/api/bitcoin/subscriptions/deleteByDeviceToken';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve()
}));

describe('deleteByDeviceToken(deviceToken, options)', () => {
  let fakeDeviceToken;
  let fakeOptions;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    fakeDeviceToken = 'ef06337c-b09e-4ed6-baf0-56eb040a077c';

    fakeOptions = {
      baseUrl: 'f9802e62-e551-463b-9e9c-c2b304383ab7'
    };

    returnValue = deleteByDeviceToken(fakeDeviceToken, fakeOptions);
  });

  it('is a function', () => {
    expect(typeof deleteByDeviceToken).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(deleteByDeviceToken.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/bitcoin/subscriptions/${deviceToken}', () => {
      const expectedUrl = `f9802e62-e551-463b-9e9c-c2b304383ab7/bitcoin/subscriptions/${fakeDeviceToken}`;
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
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          error: '3ca2e864-8c62-463c-a6be-851a6f2ad9bb'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return deleteByDeviceToken(fakeDeviceToken, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('3ca2e864-8c62-463c-a6be-851a6f2ad9bb');
      });
    });
  });

  describe('when the response is empty (success)', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.reject()
      }));
    });

    it('resolves the returned promise without any errors', () => {
      const promise = deleteByDeviceToken(fakeDeviceToken, fakeOptions);
      expect.assertions(1);
      return expect(promise).resolves.toBeTruthy();
    });
  });
});
