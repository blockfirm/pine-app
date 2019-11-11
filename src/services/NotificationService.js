/* eslint-disable max-lines */
import { AppState } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import { onRegister } from '../actions/notifications/onRegister';
import { onRegisterError } from '../actions/notifications/onRegisterError';
import { setPermissions } from '../actions/notifications/setPermissions';
import { openConversation } from '../actions/navigate';
import { sync as syncApp } from '../actions/sync';
import { add as addDeviceTokenToPine } from '../actions/pine/deviceTokens/add';

const findContactByAddress = (address, contacts) => {
  return Object.values(contacts).find((contact) => {
    return contact.address === address;
  });
};

export default class NotificationService {
  constructor(store) {
    this.store = store;

    this._lastBackgroundNotificationData = null;
    this._lastBackgroundNotificationTime = null;

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
    this._handleInitialNotification();
  }

  stop() {
    PushNotificationIOS.removeEventListener('register', this._onRegister);
    PushNotificationIOS.removeEventListener('registrationError', this._onRegisterError);
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  _register() {
    const { dispatch } = this.store;
    const state = this.store.getState();
    const { initialized, user } = state.settings;
    const hasAcceptedTerms = user && user.hasAcceptedTerms;

    // Wait until the state has loaded.
    if (!state.loaded) {
      return setTimeout(() => {
        this._register();
      }, 1000);
    }

    // Abort if wallet is not initialized or user has not accepted terms.
    if (!initialized || !hasAcceptedTerms) {
      return;
    }

    PushNotificationIOS.requestPermissions()
      .then((permissions) => dispatch(setPermissions(permissions)))
      .catch(() => { /* Suppress errors. */ });
  }

  _handleInitialNotification() {
    PushNotificationIOS.getInitialNotification().then((notification) => {
      if (notification) {
        const data = notification.getData();
        this._openConversation(data.address);
      }
    });
  }

  _shouldOpenConversation() {
    const data = this._lastBackgroundNotificationData;

    /**
     * Only navigate if app was made active by a notification
     * and it contained an address.
     */
    if (Date.now() - this._lastBackgroundNotificationTime > 1000) {
      return false;
    }

    return Boolean(data && data.address);
  }

  _openConversation(address) {
    const state = this.store.getState();
    const { dispatch } = this.store;

    if (!address) {
      return;
    }

    const { navigate, ready } = state;
    const { activeConversation } = navigate;
    const activeContact = activeConversation && activeConversation.contact;

    if (activeContact && activeContact.address === address) {
      // Conversation is already open.
      return;
    }

    const contact = findContactByAddress(address, state.contacts.items);

    if (contact) {
      return dispatch(openConversation(contact));
    }

    if (!ready) {
      return dispatch(openConversation(address));
    }

    dispatch(syncApp()).then(() => {
      dispatch(openConversation(address));
    });
  }

  _tryOpenConversation() {
    if (this._shouldOpenConversation()) {
      const { address } = this._lastBackgroundNotificationData;

      this._lastBackgroundNotificationData = null;
      this._lastBackgroundNotificationTime = null;

      this._openConversation(address);
    }
  }

  _addDeviceTokenToPine() {
    const { dispatch } = this.store;

    dispatch(addDeviceTokenToPine()).catch(() => {
      // Suppress errors.
    });
  }

  _onRegister(deviceToken) {
    const { dispatch } = this.store;

    dispatch(onRegister(deviceToken));
    this._addDeviceTokenToPine();
  }

  _onRegisterError(error) {
    const { dispatch } = this.store;
    dispatch(onRegisterError(error));
  }

  _onNotification(notification) {
    const state = this.store.getState();
    const { dispatch } = this.store;
    const { initialized } = state.settings;
    const isNotActive = this._appState.match(/inactive|background/);
    const data = notification.getData();

    if (!initialized || !data) {
      return notification.finish(PushNotificationIOS.FetchResult.ResultFailed);
    }

    if (isNotActive) {
      this._lastBackgroundNotificationData = data;
      this._lastBackgroundNotificationTime = Date.now();
    }

    /**
     * WORKAROUND: Due to a bug in iOS, network requests might fail
     * if the app is in the background or recently became active.
     * The workaround seems to be to add a delay:
     * <https://github.com/AFNetworking/AFNetworking/issues/4279>
     */
    setTimeout(() => {
      dispatch(syncApp())
        .then(() => {
          notification.finish(PushNotificationIOS.FetchResult.NewData);
        })
        .catch(() => {
          notification.finish(PushNotificationIOS.FetchResult.ResultFailed);
        });
    }, 1000);
  }

  _onAppStateChange(nextAppState) {
    if (this._appState.match(/inactive|background/) && nextAppState === 'active') {
      // The app has come to the foreground.
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
      this._tryOpenConversation();
    }

    this._appState = nextAppState;
  }
}
