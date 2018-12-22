import getByDeviceToken from '../../../../../src/api/bitcoin/subscriptions/getByDeviceToken';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    'c61ae73d-2f35-4733-8beb-60559ed70443': {},
    '61df62f1-585d-4549-87f4-37afdca1f01b': {}
  })
}));

describe('getByDeviceToken(deviceToken, options)', () => {
  let deviceToken;
  let options;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    deviceToken = '2bd0f59b-e057-4b4e-8ad9-9d1ef213b221';

    options = {
      baseUrl: 'd5afb202-730b-4dc9-810a-7772cbbe21f0'
    };

    returnValue = getByDeviceToken(deviceToken, options);
  });

  it('is a function', () => {
    expect(typeof getByDeviceToken).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getByDeviceToken.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/bitcoin/subscriptions/${deviceToken}', () => {
      const expectedUrl = `d5afb202-730b-4dc9-810a-7772cbbe21f0/bitcoin/subscriptions/${deviceToken}`;
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: 'e9321346-98d3-42c8-a0d2-37fe3123e64e'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getByDeviceToken(deviceToken, options).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('e9321346-98d3-42c8-a0d2-37fe3123e64e');
      });
    });
  });
});
