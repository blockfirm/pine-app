import getAddress from '../../../../../src/pineApi/user/address/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    address: '13484810-6a96-4001-9b75-e6e55d3d4653'
  })
}));

describe('get', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof getAddress).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getAddress.length).toBe(2);
  });

  describe('when getting an address', () => {
    let user;
    let credentials;
    let resolvedValue;

    beforeEach(() => {
      user = {
        userId: '6322ca5f-dea9-4543-932d-8ef9e8ec62a7',
        address: 'friend@pine.dev'
      };

      credentials = {
        address: 'test@pine.cash',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      return getAddress(user, credentials).then((value) => {
        resolvedValue = value;
      });
    });

    it('resolves to the address from the API', () => {
      expect(resolvedValue).toBe('13484810-6a96-4001-9b75-e6e55d3d4653'); // Mocked at the top.
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.dev/v1/users/6322ca5f-dea9-4543-932d-8ef9e8ec62a7/address', () => {
        const expectedUrl = 'https://_pine.pine.dev/v1/users/6322ca5f-dea9-4543-932d-8ef9e8ec62a7/address';
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

        it('has "method" set to "GET"', () => {
          expect(options.method).toBe('GET');
        });

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic dGVzdEBwaW5lLmNhc2g6SHlOQ2pqNlVxSjl0d085Zm9pL05rVVhUSkZaclVIaURGNDhMTUk1aTB5Ym5PSTdzVGRocG5pNnQ3YWx6UkU3a1dOS3ZMS1IwanRzbkI0akwwQ0FJS0VBPQ==');
        });
      });
    });

    describe('when the response is missing an address', () => {
      it('rejects the returned promise with an error', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        expect.hasAssertions();

        return getAddress(user, credentials).catch((error) => {
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
            message: '6fc30528-3532-4971-9858-e2613d28f598'
          })
        }));

        expect.hasAssertions();

        return getAddress(user, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('6fc30528-3532-4971-9858-e2613d28f598');
        });
      });
    });
  });
});
