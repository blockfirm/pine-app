import BackgroundFetch from 'react-native-background-fetch';
import { sync as syncApp } from '../actions';

const MINIMUM_FETCH_INTERVAL = 60; // In minutes (minimum 15).

export default class BackgroundFetchService {
  constructor(store) {
    this.store = store;
  }

  _shouldSync() {
    const state = this.store.getState();
    const { initialized, user } = state.settings;
    const { disconnected } = state.network.internet;
    const hasAcceptedTerms = user && user.hasAcceptedTerms;

    // Only sync if connected to the internet and has a wallet.
    return !disconnected && initialized && hasAcceptedTerms;
  }

  _sync() {
    const { dispatch } = this.store;

    return new Promise((resolve) => {
      /**
       * WORKAROUND: Due to a bug in iOS, network requests might fail
       * if the app is in the background or recently became active.
       * The workaround seems to be to add a delay:
       * <https://github.com/AFNetworking/AFNetworking/issues/4279>
       */
      setTimeout(() => {
        dispatch(syncApp())
          .then(() => {
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
          })
          .catch(() => {
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_FAILED);
          })
          .then(() => {
            resolve();
          });
      }, 1000);
    });
  }

  start() {
    const config = {
      minimumFetchInterval: MINIMUM_FETCH_INTERVAL
    };

    BackgroundFetch.configure(config, () => {
      if (this._shouldSync()) {
        return this._sync();
      }

      return BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_FAILED);
    }, () => {
      // BackgroundFetch failed to start.
    });
  }

  stop() {

  }
}
