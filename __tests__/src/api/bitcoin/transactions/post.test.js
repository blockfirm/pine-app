import postTransaction from '../../../../../src/api/bitcoin/transactions/post';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    txid: '04832f13-ee95-43b0-ba02-ad610df80f85'
  })
}));

describe('post(rawTransaction, options)', () => {
  let fakeTransaction;
  let fakeOptions;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    fakeTransaction = '4a6c4ae1-d315-426d-8b56-0ea146d45d12';

    fakeOptions = {
      baseUrl: '6a5d1a54-a707-449d-b866-1c29c9a21dc8'
    };

    returnValue = postTransaction(fakeTransaction, fakeOptions);
  });

  it('is a function', () => {
    expect(typeof postTransaction).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(postTransaction.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/bitcoins/transactions', () => {
      const expectedUrl = '6a5d1a54-a707-449d-b866-1c29c9a21dc8/bitcoin/transactions';
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

      it('has "body" set to a JSON string containing the transaction string', () => {
        const body = JSON.parse(options.body);

        expect(typeof body).toBe('object');
        expect(body.transaction).toBe('4a6c4ae1-d315-426d-8b56-0ea146d45d12');
      });
    });
  });

  describe('when the response is missing a txid', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({})
      }));
    });

    it('rejects the returned promise with an "Unknown error" error', () => {
      expect.hasAssertions();

      return postTransaction(fakeTransaction, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Unknown error');
      });
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: 'c84fe4ef-ed89-40af-8889-df447f700c0f'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return postTransaction(fakeTransaction, fakeOptions).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('c84fe4ef-ed89-40af-8889-df447f700c0f');
      });
    });
  });
});
