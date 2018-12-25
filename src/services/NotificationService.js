import { PushNotificationIOS, AppState } from 'react-native';
import { onRegister } from '../actions/notifications/onRegister';
import { onRegisterError } from '../actions/notifications/onRegisterError';
import { setPermissions } from '../actions/notifications/setPermissions';
import { sync as syncWallet } from '../actions/bitcoin/wallet';

export default class NotificationService {
  constructor(store) {
    this.store = store;

    this._onRegister = this._onRegister.bind(this);
    this._onRegisterError = this._onRegisterError.bind(this);
    this._onNotification = this._onNotification.bind(this);
    this._onAppStateChange = this._onAppStateChange.bind(this);
  }

  start() {
    PushNotificationIOS.setApplicationIconBadgeNumber(0);

    PushNotificationIOS.addEventListener('register', this._onRegister);
    PushNotificationIOS.addEventListener('registrationError', this._onRegisterError);
    PushNotificationIOS.addEventListener('notification', this._onNotification);

    this._appState = AppState.currentState;
    AppState.addEventListener('change', this._onAppStateChange);

    this._register();
  }

  stop() {
    PushNotificationIOS.removeEventListener('register', this._onRegister);
    PushNotificationIOS.removeEventListener('registrationError', this._onRegisterError);
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  _register() {
    const { store } = this;

    PushNotificationIOS.requestPermissions().then((permissions) => {
      store.dispatch(setPermissions(permissions));
    });
  }

  _onRegister(deviceToken) {
    const { store } = this;
    store.dispatch(onRegister(deviceToken));
  }

  _onRegisterError(error) {
    const { store } = this;
    store.dispatch(onRegisterError(error));
  }

  _onNotification() {
    const { store } = this;
    const state = store.getState();
    const { initialized } = state.settings;

    if (initialized) {
      store.dispatch(syncWallet());
    }
  }

  _onAppStateChange(nextAppState) {
    if (this._appState.match(/inactive|background/) && nextAppState === 'active') {
      // The app has come to the foreground.
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }

    this._appState = nextAppState;
  }
}
