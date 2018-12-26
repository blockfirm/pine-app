import { get as getFiatRates } from '../actions/bitcoin/fiatRates';

const UPDATE_INTERVAL = 60 * 1000; // 1 minute.

export default class FiatRatesService {
  constructor(store) {
    this.store = store;
  }

  start() {
    const { store } = this;

    // Update fiat exchange rates with an interval.
    this._updateInterval = setInterval(() => {
      const state = store.getState();
      const { initialized } = state.settings;
      const { disconnected } = state.network.internet;

      // Only update if connected to the internet and has a wallet.
      if (!disconnected && initialized) {
        store.dispatch(getFiatRates());
      }
    }, UPDATE_INTERVAL);
  }

  stop() {
    clearInterval(this._updateInterval);
  }
}
