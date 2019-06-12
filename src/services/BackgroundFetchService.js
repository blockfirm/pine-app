import BackgroundFetch from 'react-native-background-fetch';
import { sync as syncApp } from '../actions';

const MINIMUM_FETCH_INTERVAL = 60; // In minutes (minimum 15).

export default class BackgroundFetchService {
  constructor(store) {
    this.store = store;
  }

  _shouldSync() {
    const state = this.store.getState();
    const { initialized } = state.settings;
    const { hasAcceptedTerms } = state.settings.user;
    const { disconnected } = state.network.internet;

    // Only sync if connected to the internet and has a wallet.
    return !disconnected && initialized && hasAcceptedTerms;
  }

  start() {
    const { dispatch } = this.store;

    const config = {
      minimumFetchInterval: MINIMUM_FETCH_INTERVAL
    };

    BackgroundFetch.configure(config, () => {
      if (!this._shouldSync()) {
        return BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_FAILED);
      }

      setTimeout(() => {
        dispatch(syncApp())
          .then(() => {
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
          })
          .catch(() => {
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_FAILED);
          });
      }, 1000);
    }, () => {
      // BackgroundFetch failed to start.
    });
  }

  stop() {

  }
}
