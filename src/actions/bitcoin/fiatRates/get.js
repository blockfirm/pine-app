import * as api from '../../../api';

export const BITCOIN_FIAT_RATES_GET_REQUEST = 'BITCOIN_FIAT_RATES_GET_REQUEST';
export const BITCOIN_FIAT_RATES_GET_SUCCESS = 'BITCOIN_FIAT_RATES_GET_SUCCESS';
export const BITCOIN_FIAT_RATES_GET_FAILURE = 'BITCOIN_FIAT_RATES_GET_FAILURE';

const getRequest = () => {
  return {
    type: BITCOIN_FIAT_RATES_GET_REQUEST
  };
};

const getSuccess = (rates) => {
  return {
    type: BITCOIN_FIAT_RATES_GET_SUCCESS,
    rates
  };
};

const getFailure = (error) => {
  return {
    type: BITCOIN_FIAT_RATES_GET_FAILURE,
    error
  };
};

/**
 * Action to get fiat exchange rates for selected currencies.
 */
export const get = () => {
  return (dispatch, getState) => {
    const state = getState();
    const apiOptions = { baseUrl: state.settings.api.baseUrl };

    let currencies = [
      state.settings.currency.primary,
      state.settings.currency.secondary
    ];

    currencies = currencies.filter((currency) => currency !== 'BTC');

    if (!currencies.length) {
      return Promise.resolve();
    }

    dispatch(getRequest());

    return api.bitcoin.fiatRates.get(currencies, apiOptions)
      .then((rates) => {
        dispatch(getSuccess(rates));
        return rates;
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
