import addContact from '../../../../../src/pineApi/user/contacts/add';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: '6d472502-e56d-489b-a7c1-f1ee5d3283b1'
  })
}));

describe('add', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof addContact).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(addContact.length).toBe(2);
  });

  describe('when adding a contact', () => {
    let contact;
    let credentials;

    beforeEach(() => {
      contact = {
        address: 'jack@pine.pm',
        waitingForContactRequest: true
      };

      credentials = {
        address: 'timothy@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      addContact(contact, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contacts', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contacts';
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

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOkgxSm1peVFxRVF1RFl2QVRrUS9GOHRtNnNPVG50SUVvbFV3VjU5a090RnJMUHZOOWpIM1k1R2Z1cFlCV2QvKzEvK1U2TkF3OFp4blhFZXlEUEplSW5EMD0=');
        });

        describe('the body', () => {
          it('is a JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has address set to the passed contact address', () => {
            const body = JSON.parse(options.body);
            expect(body.address).toBe('jack@pine.pm');
          });

          it('has waitingForContactRequest set to the same as the passed contact', () => {
            const body = JSON.parse(options.body);
            expect(body.waitingForContactRequest).toBe(true);
          });
        });
      });
    });

    describe('when the response is missing an id', () => {
      it('rejects the returned promise with an error', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        expect.hasAssertions();

        return addContact(contact, credentials).catch((error) => {
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
            message: 'fc6e8538-bef7-4e96-91ba-e3b0d2df8294'
          })
        }));

        expect.hasAssertions();

        return addContact(contact, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('fc6e8538-bef7-4e96-91ba-e3b0d2df8294');
        });
      });
    });
  });
});
