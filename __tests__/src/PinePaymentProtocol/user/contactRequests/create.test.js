import getUser from '../../../../../src/PinePaymentProtocol/user/get';
import createContactRequest from '../../../../../src/PinePaymentProtocol/user/contactRequests/create';

jest.mock('../../../../../src/PinePaymentProtocol/user/get', () => {
  return jest.fn(() => Promise.resolve({
    id: '2890fe6b-2a1f-45e5-b902-17edc3d1be18'
  }));
});

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: '654e16a2-f08c-42ec-ae36-5b4905916e44',
    from: '6e20b6f0-afae-4775-8d16-16a9da7b3d6a',
    createdAt: 'a5d3b90e-43aa-4b2f-9cb3-6de3bef2ea13'
  })
}));

describe('create', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof createContactRequest).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(createContactRequest.length).toBe(3);
  });

  describe('when creating a contact request', () => {
    let to;
    let from;
    let mnemonic;
    let resolvedUser;

    beforeEach(() => {
      to = 'timmy@pine.cash';
      from = 'jack@pine.pm';
      mnemonic = 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant';

      return createContactRequest(to, from, mnemonic).then((user) => {
        resolvedUser = user;
      });
    });

    it('gets the user', () => {
      expect(getUser).toHaveBeenCalledWith(to);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/2890fe6b-2a1f-45e5-b902-17edc3d1be18/contact-requests', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/2890fe6b-2a1f-45e5-b902-17edc3d1be18/contact-requests';
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

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic amFja0BwaW5lLnBtOklDbDZld3dKRlNqbFVQV2ZFSHg2c3BVcEUySFdwM0JPNGN0YjlTTkRqbC96WHUwYit5YjhhbFd5akJJcHJDSEVyOTVzM095UVNJSHQ3MWMxc1YyQTI1dz0=');
        });
      });
    });

    describe('the resolved user', () => {
      it('resolves to the user with id renamed to userId', () => {
        expect(resolvedUser).toBeTruthy();
        expect(resolvedUser.id).toBeUndefined();
        expect(resolvedUser.userId).toBe('2890fe6b-2a1f-45e5-b902-17edc3d1be18'); // Mocked at the top.
      });

      it('attaches the contact request to the resolved user', () => {
        // These values are mocked at the top.
        expect(resolvedUser.contactRequest).toBeTruthy();
        expect(resolvedUser.contactRequest.id).toBe('654e16a2-f08c-42ec-ae36-5b4905916e44');
        expect(resolvedUser.contactRequest.from).toBe('6e20b6f0-afae-4775-8d16-16a9da7b3d6a');
        expect(resolvedUser.contactRequest.createdAt).toBe('a5d3b90e-43aa-4b2f-9cb3-6de3bef2ea13');
      });
    });

    describe('when the response is missing an id', () => {
      it('rejects the returned promise with an error', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        expect.hasAssertions();

        return createContactRequest(to, from, mnemonic).catch((error) => {
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
            message: '1d529bf8-5a40-42f2-92ba-4316c3f2e7d0'
          })
        }));

        expect.hasAssertions();

        return createContactRequest(to, from, mnemonic).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('1d529bf8-5a40-42f2-92ba-4316c3f2e7d0');
        });
      });
    });
  });
});
