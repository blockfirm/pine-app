import removeIncomingContactRequest from '../../../../../src/PinePaymentProtocol/user/contactRequests/removeIncoming';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve()
}));

describe('removeIncoming', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof removeIncomingContactRequest).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(removeIncomingContactRequest.length).toBe(2);
  });

  describe('when removing a contact request', () => {
    let contactRequestId;
    let credentials;

    beforeEach(() => {
      credentials = {
        address: 'test@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      contactRequestId = 'c3c2e9e0-e9e9-4aa0-ba8c-2492b83656f0';

      return removeIncomingContactRequest(contactRequestId, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contact-requests/c3c2e9e0-e9e9-4aa0-ba8c-2492b83656f0', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/ACjpRHFv7L8iN4qnVeR4U7pyhzGxSr4Z2/contact-requests/c3c2e9e0-e9e9-4aa0-ba8c-2492b83656f0';
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
          expect(options.headers['Authorization']).toBe('Basic QUNqcFJIRnY3TDhpTjRxblZlUjRVN3B5aHpHeFNyNFoyOkh6S0g3NFloWU9OTngrMENBR1dheUV3dVJqZEpkcUdHRzNWUmUrMjlWaFpITFRLZVR3Tkl0NGFBR0tadlVQT0cwNmxwRHNvL0J4WTQrdXh0OXZxdFRJcz0=');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: '6ef46cb9-c326-4575-a75d-0fe59eac2cca'
          })
        }));

        expect.hasAssertions();

        return removeIncomingContactRequest(contactRequestId, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('6ef46cb9-c326-4575-a75d-0fe59eac2cca');
        });
      });
    });
  });
});
