import getContactRequests from '../../../../../src/pineApi/user/contactRequests/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([
    {
      id: '8f4890a6-2641-4fd1-a5df-bad5b52245fe'
    }
  ])
}));

describe('get', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof getContactRequests).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getContactRequests.length).toBe(1);
  });

  describe('when getting contact requests', () => {
    let credentials
    let resolvedValue;

    beforeEach(() => {
      credentials = {
        address: 'test@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      return getContactRequests(credentials).then((value) => {
        resolvedValue = value;
      });
    });

    it('resolves to the response from the API', () => {
      expect(Array.isArray(resolvedValue)).toBe(true);
      expect(resolvedValue[0]).toBeTruthy();
      expect(resolvedValue[0].id).toBe('8f4890a6-2641-4fd1-a5df-bad5b52245fe'); // Mocked at the top.
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contact-requests', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contact-requests';
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

        it('has "method" set to "GET"', () => {
          expect(options.method).toBe('GET');
        });

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOklNZlhIYlRSeTdGK1hiTnFwVTZBbDdvajVHckI0NHBubWpSNEU5SmUyeHk2WHV1TnpGUjVGaGZFUkNmWGh5WEpYUFZWVFlVVzdiY3pwclB2SXJhY1JpVT0=');
        });
      });
    });

    describe('when the response is not an array', () => {
      it('rejects the returned promise with an error', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        expect.hasAssertions();

        return getContactRequests(credentials).catch((error) => {
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
            message: 'eeaf4fc7-b505-4460-9cb5-363ecb4a716c'
          })
        }));

        expect.hasAssertions();

        return getContactRequests(credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('eeaf4fc7-b505-4460-9cb5-363ecb4a716c');
        });
      });
    });
  });
});
