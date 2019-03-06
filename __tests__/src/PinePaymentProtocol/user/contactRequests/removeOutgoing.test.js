import removeOutgoingContactRequest from '../../../../../src/PinePaymentProtocol/user/contactRequests/removeOutgoing';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve()
}));

describe('removeOutgoing', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeOutgoingContactRequest).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(removeOutgoingContactRequest.length).toBe(2);
  });

  describe('when removing a contact request', () => {
    let contactRequest;
    let mnemonic;

    beforeEach(() => {
      contactRequest = {
        id: '91f016dc-fbc6-49fd-acd1-585b034a806a',
        from: 'you@pine.cash',
        to: 'me@pine.cash',
        toUserId: 'dc6ebff8-e709-42d4-aaa2-7535e99154ac'
      };

      mnemonic = 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant';

      return removeOutgoingContactRequest(contactRequest, mnemonic);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/dc6ebff8-e709-42d4-aaa2-7535e99154ac/contact-requests/91f016dc-fbc6-49fd-acd1-585b034a806a', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/dc6ebff8-e709-42d4-aaa2-7535e99154ac/contact-requests/91f016dc-fbc6-49fd-acd1-585b034a806a';
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
          expect(options.headers['Authorization']).toBe('Basic eW91QHBpbmUuY2FzaDpIM2ZiMW1tcTlUbldUTUdCUHlYTXN2ZVlHNzFmdmdUUTZleFY2bjlWanhuZEh1VG1LMmxpVVFndTQxbWRuclA3OC90YUV4QUZlNzlpQWcrVFhwcEhZaFk9');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: '687f08f5-c6d9-4d4b-8c16-794819f45d33'
          })
        }));

        expect.hasAssertions();

        return removeOutgoingContactRequest(contactRequest, mnemonic).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('687f08f5-c6d9-4d4b-8c16-794819f45d33');
        });
      });
    });
  });
});
