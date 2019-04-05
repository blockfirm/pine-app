import flagAsUsed from '../../../../../src/pineApi/user/address/flagAsUsed';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve()
}));

describe('flagAsUsed', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof flagAsUsed).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(flagAsUsed.length).toBe(2);
  });

  describe('when flagging addresses as used', () => {
    let addresses;
    let credentials;

    beforeEach(() => {
      addresses = [
        '65eda256-bb9c-4f8f-8986-8deeed1de0fd',
        '8e9c9605-3600-4c64-a4a6-aba0caf8b740'
      ];

      credentials = {
        address: 'test@pine.dev',
        userId: 'd62ba84b-5799-4214-a159-a063fd0652fa',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      return flagAsUsed(addresses, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.dev/v1/users/d62ba84b-5799-4214-a159-a063fd0652fa/address/used', () => {
        const expectedUrl = 'https://_pine.pine.dev/v1/users/d62ba84b-5799-4214-a159-a063fd0652fa/address/used';
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
          expect(options.headers['Authorization']).toBe('Basic ZDYyYmE4NGItNTc5OS00MjE0LWExNTktYTA2M2ZkMDY1MmZhOkg4TU5qcDBSakcrMU52SGp2YlhERkdsWWk1dWphaGsra2NGZlVpK0tXUWlzRDFxVG1EWmVHOEh4dGJEdXNzZVV3Q3p2Z2hBUzBXdnU2c1JoUS9vTXhVaz0=');
        });

        describe('the body', () => {
          it('is a JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has "addresses" set to the passed addresses', () => {
            const body = JSON.parse(options.body);
            expect(body.addresses).toEqual(addresses);
          });
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: 'cab300f9-9ada-43b4-86eb-34f499236e21'
          })
        }));

        expect.hasAssertions();

        return flagAsUsed(addresses, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('cab300f9-9ada-43b4-86eb-34f499236e21');
        });
      });
    });
  });
});
