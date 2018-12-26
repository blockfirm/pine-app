import * as fiatRatesActions from '../../../actions/bitcoin/fiatRates';

const ratesReducer = (state = {}, action) => {
  switch (action.type) {
    case fiatRatesActions.BITCOIN_FIAT_RATES_GET_SUCCESS:
      return {
        ...action.rates
      };

    default:
      return state;
  }
};

export default ratesReducer;
