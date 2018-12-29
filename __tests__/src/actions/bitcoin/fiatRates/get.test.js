import * as api from '../../../../../src/api';

import {
  get as getFiatRates,
  BITCOIN_FIAT_RATES_GET_REQUEST,
  BITCOIN_FIAT_RATES_GET_SUCCESS,
  BITCOIN_FIAT_RATES_GET_FAILURE
} from '../../../../../src/actions/bitcoin/fiatRates/get';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    api: {
      baseUrl: '503080a6-f4b9-48ae-99ae-b72807c83e68'
    },
    currency: {
      primary: 'EUR',
      secondary: 'SEK'
    }
  }
}));

jest.mock('../../../../../src/api', () => ({
  bitcoin: {
    fiatRates: {
      get: jest.fn(() => Promise.resolve({
        EUR: 3277.00,
        SEK: 33900.68
      }))
    }
  }
}));

describe('BITCOIN_FIAT_RATES_GET_REQUEST', () => {
  it('equals "BITCOIN_FIAT_RATES_GET_REQUEST"', () => {
    expect(BITCOIN_FIAT_RATES_GET_REQUEST).toBe('BITCOIN_FIAT_RATES_GET_REQUEST');
  });
});

describe('BITCOIN_FIAT_RATES_GET_SUCCESS', () => {
  it('equals "BITCOIN_FIAT_RATES_GET_SUCCESS"', () => {
    expect(BITCOIN_FIAT_RATES_GET_SUCCESS).toBe('BITCOIN_FIAT_RATES_GET_SUCCESS');
  });
});

describe('BITCOIN_FIAT_RATES_GET_FAILURE', () => {
  it('equals "BITCOIN_FIAT_RATES_GET_FAILURE"', () => {
    expect(BITCOIN_FIAT_RATES_GET_FAILURE).toBe('BITCOIN_FIAT_RATES_GET_FAILURE');
  });
});

describe('getFiatRates', () => {
  beforeEach(() => {
    api.bitcoin.fiatRates.get.mockClear();
  });

  it('is a function', () => {
    expect(typeof getFiatRates).toBe('function');
  });

  it('returns a function', () => {
    const returnValue = getFiatRates();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = getFiatRates();
    });

    it('dispatches an action of type BITCOIN_FIAT_RATES_GET_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: BITCOIN_FIAT_RATES_GET_REQUEST
      });
    });

    it('gets the fiat rates with api.bitcoin.fiatRates.get() using the currencies from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedCurrencies = ['EUR', 'SEK'];

        const expectedOptions = {
          baseUrl: '503080a6-f4b9-48ae-99ae-b72807c83e68'
        };

        expect(api.bitcoin.fiatRates.get).toHaveBeenCalledTimes(1);
        expect(api.bitcoin.fiatRates.get).toHaveBeenCalledWith(expect.arrayContaining(expectedCurrencies), expectedOptions);
      });
    });

    it('filters out BTC currencies', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: '503080a6-f4b9-48ae-99ae-b72807c83e68'
          },
          currency: {
            primary: 'EUR',
            secondary: 'BTC'
          }
        }
      }));

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedCurrencies = ['EUR'];
        expect(api.bitcoin.fiatRates.get).toHaveBeenCalledWith(expect.arrayContaining(expectedCurrencies), expect.any(Object));
      });
    });

    it('does not call the API if no fiat currencies has been selected', () => {
      expect.hasAssertions();

      getStateMock.mockImplementationOnce(() => ({
        settings: {
          api: {
            baseUrl: '503080a6-f4b9-48ae-99ae-b72807c83e68'
          },
          currency: {
            primary: 'BTC',
            secondary: 'BTC'
          }
        }
      }));

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        expect(api.bitcoin.fiatRates.get).toHaveBeenCalledTimes(0);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('dispatches an action of type BITCOIN_FIAT_RATES_GET_SUCCESS with the fiat rates', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_FIAT_RATES_GET_SUCCESS,
            rates: {
              EUR: 3277.00,
              SEK: 33900.68
            }
          });
        });
      });

      it('resolves to the fiat rates', () => {
        expect.hasAssertions();

        return promise.then((rates) => {
          expect(rates).toMatchObject({
            EUR: 3277.00,
            SEK: 33900.68
          });
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.bitcoin.fiatRates.get().
        api.bitcoin.fiatRates.get.mockImplementationOnce(() => Promise.reject(
          new Error('100a495c-143a-4f46-a174-058aa63484df')
        ));

        promise = getFiatRates()(dispatchMock, getStateMock);
      });

      it('suppresses the error', () => {
        expect.hasAssertions();
        return expect(promise).resolves.toBe(undefined);
      });

      it('dispatches an action of type BITCOIN_FIAT_RATES_GET_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: BITCOIN_FIAT_RATES_GET_FAILURE,
            error: expect.objectContaining({
              message: '100a495c-143a-4f46-a174-058aa63484df'
            })
          });
        });
      });
    });
  });
});
