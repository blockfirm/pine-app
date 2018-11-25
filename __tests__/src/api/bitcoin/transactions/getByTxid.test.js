import getTransactionByTxid from '../../../../../src/api/bitcoin/transactions/getByTxid';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    'bbbeabfa-b51d-4538-9b76-305a6731f0cf': {},
    '805c25a8-a208-4ca1-b5d4-9eb6168e8664': {}
  })
}));

describe('getByTxid(txid, options)', () => {
  let txid;
  let options;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    txid = '9b83221f-ced1-4735-b938-1aaab21abf71';

    options = {
      baseUrl: 'ff2d3ec9-40fa-498f-963e-b33cd3ed70d3'
    };

    returnValue = getTransactionByTxid(txid, options);
  });

  it('is a function', () => {
    expect(typeof getTransactionByTxid).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getTransactionByTxid.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/bitcoin/transactions/${txid}', () => {
      const expectedUrl = `ff2d3ec9-40fa-498f-963e-b33cd3ed70d3/bitcoin/transactions/${txid}`;
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: '33e1c17c-a96a-4411-94a3-a85b7e4c3abe'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getTransactionByTxid(txid, options).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('33e1c17c-a96a-4411-94a3-a85b7e4c3abe');
      });
    });
  });
});
