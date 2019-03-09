import removeContact from '../../../../../src/PinePaymentProtocol/user/contacts/remove';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: '6d472502-e56d-489b-a7c1-f1ee5d3283b1'
  })
}));

describe('remove', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeContact).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(removeContact.length).toBe(2);
  });

  describe('when adding a contact', () => {
    let contactId;
    let credentials;

    beforeEach(() => {
      contactId = '23678d56-2fdf-46c6-8b3c-fb7d44801c4e';

      credentials = {
        address: 'timothy@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      removeContact(contactId, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contacts/23678d56-2fdf-46c6-8b3c-fb7d44801c4e', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contacts/23678d56-2fdf-46c6-8b3c-fb7d44801c4e';
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

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOkh4KzM1dVNldVk1ZjRIR3U2SWlkMG1wOHRPQWppdUt1ZnUwa3hYOU5taWVqZGMwc3ZudHdBR2NZdXZ1TGY3WDN5VWpWd3h5WUZEdm14U2phN3VBVW1TUT0=');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'caa0cd16-c543-43f3-ab6e-f9e238042440'
          })
        }));

        expect.hasAssertions();

        return removeContact(contactId, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('caa0cd16-c543-43f3-ab6e-f9e238042440');
        });
      });
    });
  });
});
