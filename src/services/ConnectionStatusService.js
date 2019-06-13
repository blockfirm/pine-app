import { AppState, NetInfo } from 'react-native';
import { sync as syncApp } from '../actions/sync';
import * as internetActions from '../actions/network/internet';

export default class ConnectionStatusService {
  constructor(store) {
    this.store = store;

    this._onAppStateChange = this._onAppStateChange.bind(this);
    this._onConnectionChange = this._onConnectionChange.bind(this);
  }

  start() {
    this._isConnectedToInternet = null;

    // Get initial app state.
    this._appState = AppState.currentState;

    // Listen for app state changes (e.g. when app becomes active).
    AppState.addEventListener('change', this._onAppStateChange);

    // Listen for internet connection changes.
    NetInfo.isConnected.addEventListener('connectionChange', this._onConnectionChange);
  }

  stop() {
    AppState.removeEventListener('change', this._onAppStateChange);
    NetInfo.isConnected.removeEventListener('connectionChange', this._onConnectionChange);
  }

  _onAppStateChange(nextAppState) {
    if (this._appState.match(/inactive|background/) && nextAppState === 'active') {
      // The app has come to the foreground.
      this._appState = nextAppState;
      this._updateInternetConnectionStatus();
    }

    this._appState = nextAppState;
  }

  _updateInternetConnectionStatus() {
    NetInfo.isConnected.fetch().then(this._onConnectionChange);
  }

  _onConnectionChange(isConnected) {
    const { store } = this;

    if (isConnected) {
      store.dispatch(internetActions.connected());

      if (this._isConnectedToInternet === false && this._appState === 'active') {
        this._syncApp();
      }
    } else {
      store.dispatch(internetActions.disconnected());
    }

    this._isConnectedToInternet = isConnected;
  }

  _syncApp() {
    const { store } = this;
    const state = store.getState();
    const { initialized, user } = state.settings;
    const hasAcceptedTerms = user && user.hasAcceptedTerms;

    if (initialized && hasAcceptedTerms) {
      store.dispatch(syncApp());
    }
  }
}
