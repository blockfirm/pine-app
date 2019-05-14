import { AppState } from 'react-native';
import { sync as syncApp } from '../actions';

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
      this._syncApp();
    }, SYNC_INTERVAL);
  }

  stop() {
    clearInterval(this._syncInterval);
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  _onAppStateChange(nextAppState) {
    if (this._appState === 'background' && nextAppState === 'active') {
      // The app has come to the foreground.
      this._syncApp();
    }

    this._appState = nextAppState;
  }

  _syncApp() {
    const { store } = this;
    const state = store.getState();
    const { initialized } = state.settings;
    const { hasAcceptedTerms } = state.settings.user;
    const { disconnected } = state.network.internet;

    // Only sync if connected to the internet and has a wallet.
    if (!disconnected && initialized && hasAcceptedTerms) {
      store.dispatch(syncApp());
    }
  }
}
