import getContacts from '../../../../../src/pineApi/user/contacts/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([
    {
      id: '7f83e377-2666-42ad-9ab5-c147bf46d006'
    }
  ])
}));

describe('get', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof getContacts).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getContacts.length).toBe(1);
  });

  describe('when getting contacts', () => {
    let credentials;

    beforeEach(() => {
      credentials = {
        address: 'timothy@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      getContacts(credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://pine-payment-server.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contacts', () => {
        const expectedUrl = 'https://pine-payment-server.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contacts';
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

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOkgvQnUwTTRVdDF6TUl2YnNldFpPUHlCMGx5dlE2UURZWk1SUE5Ta25EbXRUWmdoazYyemZjR3FHYXdYR21IWFZMaHlDeVczTUZ0Nm42b2k4Z3M5K3I3VT0=');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'a8b0b9aa-3e97-487d-ae47-cfea94be94f4'
          })
        }));

        expect.hasAssertions();

        return getContacts(credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('a8b0b9aa-3e97-487d-ae47-cfea94be94f4');
        });
      });
    });
  });
});
