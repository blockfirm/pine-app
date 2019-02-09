import getFeeEstimate from '../../../../../../src/api/bitcoin/fees/estimate/get';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => ({
    satoshisPerByte: 3.5
  })
}));

describe('get(numberOfBlocks, options)', () => {
  let numberOfBlocks;
  let options;
  let returnValue;

  beforeEach(() => {
    fetch.mockClear();

    numberOfBlocks = 1;

    options = {
      baseUrl: '31980d28-13fc-4af1-9879-5d1c8a3db35d'
    };

    returnValue = getFeeEstimate(numberOfBlocks, options);
  });

  it('is a function', () => {
    expect(typeof getFeeEstimate).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(getFeeEstimate.length).toBe(2);
  });

  it('makes an HTTP request using fetch', () => {
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns a Promise', () => {
    expect(returnValue).toBeInstanceOf(Promise);
  });

  it('resolves to satoshisPerByte from the response', () => {
    expect.hasAssertions();

    return returnValue.then((satoshisPerByte) => {
      // This value is mocked at the top of this file.
      expect(satoshisPerByte).toBe(3.5);
    });
  });

  describe('the HTTP request', () => {
    it('is made to the url ${options.baseUrl}/v1/bitcoin/fees/estimate?numberOfBlocks=${numberOfBlocks}', () => {
      const expectedUrl = `31980d28-13fc-4af1-9879-5d1c8a3db35d/v1/bitcoin/fees/estimate?numberOfBlocks=${numberOfBlocks}`;
      expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('when the response is an error', () => {
    beforeEach(() => {
      global.fetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => ({
          error: '1af3edf8-4594-4e11-b618-d9517513a00b'
        })
      }));
    });

    it('rejects the returned promise with the error message from the response', () => {
      expect.hasAssertions();

      return getFeeEstimate(numberOfBlocks, options).catch((error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe('1af3edf8-4594-4e11-b618-d9517513a00b');
      });
    });
  });
});
