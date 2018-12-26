import * as fiatRatesActions from '../../../../../src/actions/bitcoin/fiatRates';
import ratesReducer from '../../../../../src/reducers/bitcoin/fiat/rates';

describe('ratesReducer', () => {
  it('is a function', () => {
    expect(typeof ratesReducer).toBe('function');
  });

  describe('when action is BITCOIN_FIAT_RATES_GET_SUCCESS', () => {
    it('returns the rates from the action', () => {
      const oldState = {
        SEK: 33000
      };

      const actionRates = {
        EUR: 3333.80
      };

      const action = {
        type: fiatRatesActions.BITCOIN_FIAT_RATES_GET_SUCCESS,
        rates: actionRates
      };

      const newState = ratesReducer(oldState, action);

      expect(newState).toMatchObject(actionRates);
    });
  });

  describe('when action is an unknown type', () => {
    it('returns the old state', () => {
      const oldState = { USD: 3000 };
      const action = { type: 'UNKNOWN' };
      const newState = ratesReducer(oldState, action);

      expect(newState).toBe(oldState);
    });
  });

  describe('when state is not defined', () => {
    it('returns an empty object', () => {
      const action = { type: 'UNKNOWN' };
      const newState = ratesReducer(undefined, action);

      expect(newState).toEqual({});
    });
  });
});
