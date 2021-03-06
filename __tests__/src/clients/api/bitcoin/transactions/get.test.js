import querystring from 'querystring';
import getTransactions from '../../../../../../src/clients/api/bitcoin/transactions/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    '62be50ad-6dad-4d57-868b-3ba76accf8de': {},
    '9ee7d667-deb5-44bc-a87a-1bbdfd306287': {}
  })
}));

describe('get(addresses, page, pageSize, reverse, options)', () => {
  let addresses;
  let page;
  let pageSize;
  let reverse;
  let options;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    addresses = [
      '62be50ad-6dad-4d57-868b-3ba76accf8de',
      '9ee7d667-deb5-44bc-a87a-1bbdfd306287'
    ];

    page = 1;
    pageSize = 100;
    reverse = false;

    options = {
      baseUrl: 'f1818a98-8ba3-4b8d-b832-4d9864abfca8'
    };

    returnValue = getTransactions(addresses, page, pageSize, reverse, options);
  });

  it('is a function', () => {
    expect(typeof getTransactions).toBe('function');
  });

  it('accepts five arguments', () => {
    expect(getTransactions.length).toBe(5);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/v1/bitcoin/transactions?addresses=62be50ad-6dad-4d57-868b-3ba76accf8de%2C9ee7d667-deb5-44bc-a87a-1bbdfd306287&page=1&page_size=100&reverse=0', () => {
      const queryParams = {
        addresses: addresses.join(','),
        page: page,
        // eslint-disable-next-line camelcase
        page_size: pageSize,
        reverse: reverse ? '1' : '0'
      };

      const queryString = querystring.stringify(queryParams);
      const expectedUrl = `f1818a98-8ba3-4b8d-b832-4d9864abfca8/v1/bitcoin/transactions?${queryString}`;

      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: 'aeffecd9-2432-43b0-a440-2c5fe323b26b'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getTransactions(addresses, page, pageSize, reverse, options).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('aeffecd9-2432-43b0-a440-2c5fe323b26b');
      });
    });
  });
});
