import getFiatRates from '../../../../../src/api/bitcoin/fiatRates/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    EUR: 3277.00,
    SEK: 33900.68
  })
}));

describe('get(currencies, options)', () => {
  let currencies;
  let options;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    currencies = ['EUR', 'SEK'];

    options = {
      baseUrl: '348510c6-a029-4bef-980d-379df5d58bd2'
    };

    returnValue = getFiatRates(currencies, options);
  });

  it('is a function', () => {
    expect(typeof getFiatRates).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getFiatRates.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  it('resolves to rates from the response', () => {
    expect.hasAssertions();

    return returnValue.then((rates) => {
      // This object is mocked at the top of this file.
      expect(rates).toMatchObject({
        EUR: 3277.00,
        SEK: 33900.68
      });
    });
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/v1/bitcoin/fiatrates?currencies=${currencies}', () => {
      const currenciesParam = encodeURIComponent(currencies.join(','));
      const expectedUrl = `348510c6-a029-4bef-980d-379df5d58bd2/v1/bitcoin/fiatrates?currencies=${currenciesParam}`;
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: 'a3883133-195f-4ad7-8ebc-532266cd8bb0'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getFiatRates(currencies, options).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('a3883133-195f-4ad7-8ebc-532266cd8bb0');
      });
    });
  });
});
