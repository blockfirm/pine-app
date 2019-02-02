import create from '../../../../src/PinePaymentProtocol/user/create';

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

  it('accepts two arguments', () => {
    expect(create.length).toBe(2);
  });

  describe('when creating a new user with address "timothy@pine.cash"', () => {
    let address;
    let mnemonic;

    beforeEach(() => {
      address = 'timothy@pine.cash';
      mnemonic = 'test boss fly battle rubber wasp afraid whale hamster guide vibrant tattoo';

      create(address, mnemonic);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.cash/v1/users', () => {
        const expectedUrl = 'https://_pine.pine.cash/v1/users';
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

        describe('the body', () => {
          it('is JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has id set to "AuC8zwhrhWMcvC8FoWAxJA7HnMuBz5W5n"', () => {
            const body = JSON.parse(options.body);
            expect(body.id).toBe('AuC8zwhrhWMcvC8FoWAxJA7HnMuBz5W5n');
          });

          it('has publicKey set to "6wwD1rXXJWq47AgwntDgbqqmby6NqUqbNmjU2V4wVo4qS2zWyF"', () => {
            const body = JSON.parse(options.body);
            expect(body.publicKey).toBe('6wwD1rXXJWq47AgwntDgbqqmby6NqUqbNmjU2V4wVo4qS2zWyF');
          });

          it('has username set to "timothy"', () => {
            const body = JSON.parse(options.body);
            expect(body.username).toBe('timothy');
          });

          it('has signature set to "HxpNIuGN53r4qbh1VGD7KWcCA824FH+iuV/nrmiApIe2I5t2cG7HuwDCKmHWZkaPEJh4oX9jIuHpbCDKfkbbOIE="', () => {
            const body = JSON.parse(options.body);
            expect(body.signature).toBe('HxpNIuGN53r4qbh1VGD7KWcCA824FH+iuV/nrmiApIe2I5t2cG7HuwDCKmHWZkaPEJh4oX9jIuHpbCDKfkbbOIE=');
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
