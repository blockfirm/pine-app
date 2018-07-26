import querystring from 'querystring';
import getTransactions from '../../../../../src/api/bitcoin/transactions/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    '62be50ad-6dad-4d57-868b-3ba76accf8de': {},
    '9ee7d667-deb5-44bc-a87a-1bbdfd306287': {}
  })
}));

describe('get(addresses, page, options)', () => {
  let fakeAddresses;
  let fakePage;
  let fakeOptions;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    fakeAddresses = [
      '62be50ad-6dad-4d57-868b-3ba76accf8de',
      '9ee7d667-deb5-44bc-a87a-1bbdfd306287'
    ];

    fakePage = 1;

    fakeOptions = {
      baseUrl: 'f1818a98-8ba3-4b8d-b832-4d9864abfca8'
    };

    returnValue = getTransactions(fakeAddresses, fakePage, fakeOptions);
  });

  it('is a function', () => {
    expect(typeof getTransactions).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(getTransactions.length).toBe(3);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/bitcoins/transactions?addresses=62be50ad-6dad-4d57-868b-3ba76accf8de%2C9ee7d667-deb5-44bc-a87a-1bbdfd306287&page=1', () => {
      const queryParams = {
        addresses: fakeAddresses.join(','),
        page: fakePage
      };

      const queryString = querystring.stringify(queryParams);
      const expectedUrl = `f1818a98-8ba3-4b8d-b832-4d9864abfca8/bitcoin/transactions?${queryString}`;

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

      return getTransactions(fakeAddresses, fakePage, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('aeffecd9-2432-43b0-a440-2c5fe323b26b');
      });
    });
  });
});
