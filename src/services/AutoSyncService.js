import { AppState } from 'react-native';
import { sync as syncApp } from '../actions';
import { updateProfiles } from '../actions/contacts';

const SYNC_INTERVAL = 30 * 1000; // 30 seconds.

export default class AutoSyncService {
  constructor(store) {
    this.store = store;
    this._onAppStateChange = this._onAppStateChange.bind(this);
  }

  start() {
    this._appState = AppState.currentState;
    AppState.addEventListener('change', this._onAppStateChange);
    this._startInterval();
  }

  stop() {
    this._stopInterval();
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  _startInterval() {
    this._stopInterval();

    this._syncInterval = setInterval(() => {
      if (this._appState !== 'background') {
        this._syncApp();
      }
    }, SYNC_INTERVAL);
  }

  _stopInterval() {
    clearInterval(this._syncInterval);
  }

  _onAppStateChange(nextAppState) {
    if (this._appState === 'background' && nextAppState === 'active') {
      /**
       * WORKAROUND: Due to a bug in iOS, network requests might fail
       * if the app is in the background or recently became active.
       * The workaround seems to be to add a delay:
       * <https://github.com/AFNetworking/AFNetworking/issues/4279>
       */
      setTimeout(() => {
        this._syncApp();
        this._updateProfiles();
      }, 1000);
    }

    if (nextAppState === 'active') {
      this._startInterval();
    }

    if (nextAppState === 'background') {
      this._stopInterval();
    }

    this._appState = nextAppState;
  }

  _shouldSync() {
    const { store } = this;
    const state = store.getState();
    const { initialized, user } = state.settings;
    const { disconnected } = state.network.internet;
    const hasAcceptedTerms = user && user.hasAcceptedTerms;

    // Only sync if connected to the internet and has a wallet.
    return !disconnected && initialized && hasAcceptedTerms;
  }

  _syncApp() {
    const { dispatch } = this.store;

    if (this._shouldSync()) {
      dispatch(syncApp());
    }
  }

  _updateProfiles() {
    const { dispatch } = this.store;

    if (this._shouldSync()) {
      dispatch(updateProfiles()).catch(() => { /* Suppress errors */ });
    }
  }
}
