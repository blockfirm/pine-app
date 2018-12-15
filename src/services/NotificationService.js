import { PushNotificationIOS } from 'react-native';
import { onRegister } from '../actions/notifications/onRegister';
import { onRegisterError } from '../actions/notifications/onRegisterError';
import { setPermissions } from '../actions/notifications/setPermissions';

export default class NotificationService {
  constructor(store) {
    this.store = store;

    this._onRegister = this._onRegister.bind(this);
    this._onRegisterError = this._onRegisterError.bind(this);
  }

  start() {
    PushNotificationIOS.addEventListener('register', this._onRegister);
    PushNotificationIOS.addEventListener('registrationError', this._onRegisterError);

    this._register();
  }

  stop() {
    PushNotificationIOS.removeEventListener('register', this._onRegister);
    PushNotificationIOS.removeEventListener('registrationError', this._onRegisterError);
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
}
