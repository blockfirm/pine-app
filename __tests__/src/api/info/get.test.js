import getInfo from '../../../../src/api/info/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    network: '84a0681b-494a-4ac2-8298-2b888799f467'
  })
}));

describe('get(options)', () => {
  let options;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    options = {
      baseUrl: '377b301c-9723-48fc-82a6-238217d71b23'
    };

    returnValue = getInfo(options);
  });

  it('is a function', () => {
    expect(typeof getInfo).toBe('function');
  });

  it('accepts one argument', () => {
    expect(getInfo.length).toBe(1);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  it('resolves to the JSON from the response', () => {
    expect.hasAssertions();

    return returnValue.then((info) => {
      // This value is mocked at the top of this file.
      expect(info.network).toBe('84a0681b-494a-4ac2-8298-2b888799f467');
    });
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/v1/info', () => {
      const expectedUrl = '377b301c-9723-48fc-82a6-238217d71b23/v1/info';
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: '26824e4a-3606-4dcc-b92b-d6adeea975ff'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getInfo(options).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('26824e4a-3606-4dcc-b92b-d6adeea975ff');
      });
    });
  });
});
