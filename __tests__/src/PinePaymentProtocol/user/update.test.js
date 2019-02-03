import update from '../../../../src/PinePaymentProtocol/user/update';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: '8b6e72ac-7bc5-427b-8b04-6b91ab73b9af'
  })
}));

describe('update', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof update).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(update.length).toBe(3);
  });

  describe('when updating a user with address "timothy@pine.cash"', () => {
    let address;
    let user;
    let mnemonic;

    beforeEach(() => {
      address = 'timothy@pine.cash';
      user = { displayName: 'e072c1d7-779d-4de5-b8ed-c1fa25ae3fc9' };
      mnemonic = 'test boss fly battle rubber wasp afraid party whale hamster guide vibrant';

      update(address, user, mnemonic);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users/LJHcBGBHbXaTN7cZbX97EAFPrxcVc2f6f', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users/LJHcBGBHbXaTN7cZbX97EAFPrxcVc2f6f';
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

        it('has "method" set to "PATCH"', () => {
          expect(options.method).toBe('PATCH');
        });

        it('has header "Content-Type" set to "application/json"', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Content-Type']).toBe('application/json');
        });

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic TEpIY0JHQkhiWGFUTjdjWmJYOTdFQUZQcnhjVmMyZjZmOkgxdXAyb2Qxb1Frakh2SlFVb1Q2cUNML21sL2ZodThXdGNkcWNEbkZlNm9ESEs5anJnTDJQTDlhUDFxai83L0dTSWJFbGNsQy9sT0lvZVJmaXM1Tm5jYz0=');
        });

        describe('the body', () => {
          it('is a JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has displayName set to the display name of the user', () => {
            const body = JSON.parse(options.body);
            expect(body.displayName).toBe('e072c1d7-779d-4de5-b8ed-c1fa25ae3fc9');
          });
        });
      });
    });

    describe('when the response is missing an id', () => {
      beforeEach(() => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));
      });

      it('rejects the returned promise with an error', () => {
        expect.hasAssertions();

        return update(address, user, mnemonic).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Unknown error');
        });
      });
    });

    describe('when the response is an error', () => {
      beforeEach(() => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: '112c85a8-37f8-42cb-8474-4478a1e8c18e'
          })
        }));
      });

      it('rejects the returned promise with the error message from the response', () => {
        expect.hasAssertions();

        return update(address, user, mnemonic).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('112c85a8-37f8-42cb-8474-4478a1e8c18e');
        });
      });
    });
  });
});
