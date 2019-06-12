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
    // Get initial app state.
    this._appState = AppState.currentState;

    // Listen for app state changes (e.g. when app becomes active).
    AppState.addEventListener('change', this._onAppStateChange);

    // Sync app with an interval.
    this._syncInterval = setInterval(() => {
      if (this._appState !== 'background') {
        this._syncApp();
      }
    }, SYNC_INTERVAL);
  }

  stop() {
    clearInterval(this._syncInterval);
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  _onAppStateChange(nextAppState) {
    if (this._appState === 'background' && nextAppState === 'active') {
      // The app has come to the foreground.
      setTimeout(() => {
        this._syncApp();
        this._updateProfiles();
      }, 1000);
    }

    this._appState = nextAppState;
  }

  _shouldSync() {
    const { store } = this;
    const state = store.getState();
    const { initialized } = state.settings;
    const { hasAcceptedTerms } = state.settings.user;
    const { disconnected } = state.network.internet;

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
