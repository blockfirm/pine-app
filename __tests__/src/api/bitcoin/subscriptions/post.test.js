import postSubscription from '../../../../../src/api/bitcoin/subscriptions/post';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => undefined
}));

describe('post(deviceToken, addresses, options)', () => {
  let fakeDeviceToken;
  let fakeAddresses;
  let fakeOptions;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    fakeDeviceToken = '4a6c4ae1-d315-426d-8b56-0ea146d45d12';

    fakeAddresses = [
      'ccd15f33-d021-4f9e-a9a2-e6778368a630',
      '34e8cfc6-776d-4d95-985d-ef30fb888a47'
    ];

    fakeOptions = {
      baseUrl: '9cd19902-bf03-4f71-91a5-de6d864f2a40'
    };

    returnValue = postSubscription(fakeDeviceToken, fakeAddresses, fakeOptions);
  });

  it('is a function', () => {
    expect(typeof postSubscription).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(postSubscription.length).toBe(3);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/bitcoin/subscriptions', () => {
      const expectedUrl = '9cd19902-bf03-4f71-91a5-de6d864f2a40/bitcoin/subscriptions';
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

      it('has "body" set to a JSON string containing the deviceToken and addresses', () => {
        const body = JSON.parse(options.body);

        expect(typeof body).toBe('object');
        expect(body.deviceToken).toBe(fakeDeviceToken);
        expect(body.addresses).toEqual(expect.arrayContaining(fakeAddresses));
      });
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: '20671a82-5813-4b27-a612-bdcb3620a88e'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return postSubscription(fakeDeviceToken, fakeAddresses, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('20671a82-5813-4b27-a612-bdcb3620a88e');
      });
    });
  });
});
