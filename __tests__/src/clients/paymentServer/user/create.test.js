import create from '../../../../../src/clients/paymentServer/user/create';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: '856d3ed9-68e5-4fca-a4a8-aa8a1baef10d'
  })
}));

describe('create', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof create).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(create.length).toBe(3);
  });

  describe('when creating a new user with address "timothy@pine.cash"', () => {
    let address;
    let mnemonic;
    let bitcoinNetwork;

    beforeEach(() => {
      address = 'timothy@pine.cash';
      mnemonic = 'test boss fly battle rubber wasp afraid whale hamster guide vibrant tattoo';
      bitcoinNetwork = 'testnet';

      create(address, mnemonic, bitcoinNetwork);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://pine-payment-server.pine.cash/v1/users', () => {
        const expectedUrl = 'https://pine-payment-server.pine.cash/v1/users';
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
          expect(options.headers['Authorization']).toBe('Basic QXVDOHp3aHJoV01jdkM4Rm9XQXhKQTdIbk11Qno1VzVuOkgrcEh1aUhxMkVHSkErbFB2eVhFQ01sMVN6YVVyREF0MXEwRU5Wd3Rra0tvZE5naHpQakFBbnozc1VIbzdmWXRoK0djSXFKSWUxdjBVMEN0YW9WSXRwST0=');
        });

        describe('the body', () => {
          it('is a JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has publicKey set to "6wwD1rXXJWq47AgwntDgbqqmby6NqUqbNmjU2V4wVo4qS2zWyF"', () => {
            const body = JSON.parse(options.body);
            expect(body.publicKey).toBe('6wwD1rXXJWq47AgwntDgbqqmby6NqUqbNmjU2V4wVo4qS2zWyF');
          });

          it('has extendedPublicKey set to the extended public key for BIP49 account 0 for the mnemonic', () => {
            const body = JSON.parse(options.body);
            expect(body.extendedPublicKey).toBe('tpubDCRsxDU6ZjHA1jpa7ceek6ixhDS6qY3oqqcmUG6ycGcSW4qcTgzJURiw8Kph6c7NgKjzJt8vq6d2UwocjHAvpGi7cQNEwuZzShnu5yNnHPt');
          });

          it('has username set to "timothy"', () => {
            const body = JSON.parse(options.body);
            expect(body.username).toBe('timothy');
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

        return create(address, mnemonic).catch((error) => {
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
            message: '066345d6-4476-4d26-b670-f4e43ea952f7'
          })
        }));
      });

      it('rejects the returned promise with the error message from the response', () => {
        expect.hasAssertions();

        return create(address, mnemonic).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('066345d6-4476-4d26-b670-f4e43ea952f7');
        });
      });
    });
  });
});
