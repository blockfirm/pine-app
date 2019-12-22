import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../contexts/theme';
import { handle as handleError } from '../actions/error';
import { reset as navigateWithReset } from '../actions/navigate';
import { setPermissions } from '../actions/notifications/setPermissions';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paragraph: {
    textAlign: 'center',
    maxWidth: 290,
    marginBottom: 100
  },
  footerParagraph: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: undefined
  },
  notificationImage: {
    width: 313,
    height: 97,
    marginBottom: 40
  },
  loader: {
    height: 42
  }
});

@connect()
class TurnOnNotificationsScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    loading: true
  }

  componentDidMount() {
    PushNotificationIOS.checkPermissions((permissions) => {
      if (permissions && (permissions.alert || permissions.badge || permissions.sound)) {
        return this._turnOnNotifications();
      }

      this.setState({ loading: false });
    });
  }

  _turnOnNotifications() {
    const { dispatch } = this.props;

    PushNotificationIOS.requestPermissions()
      .then((permissions) => {
        dispatch(setPermissions(permissions));
        this._showHomeScreen();
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _showHomeScreen() {
    const { dispatch } = this.props;
    dispatch(navigateWithReset('Home'));
  }

  _renderLoader() {
    return (
      <BaseScreen style={styles.view}>
        <ActivityIndicator color='gray' style={styles.loader} size='small' />
      </BaseScreen>
    );
  }

  render() {
    const { theme } = this.props;

    if (this.state.loading) {
      return this._renderLoader();
    }

    return (
      <BaseScreen style={styles.view} headerTitle='Turn on Notifications'>
        <Image source={theme.illustrationNotification} style={styles.notificationImage} />

        <Paragraph style={styles.paragraph}>
          Pine uses notifications to notify you about contact requests and incoming payments.
          They also enable Pine to redeem payments automatically in the background.
        </Paragraph>

        <Footer>
          <Paragraph style={styles.footerParagraph}>
            When asked, allow Pine to send notifications for the best experience ✨👌
          </Paragraph>

          <Button
            label='Continue'
            onPress={this._turnOnNotifications.bind(this)}
            runAfterInteractions={true}
          />
        </Footer>
      </BaseScreen>
    );
  }
}

TurnOnNotificationsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(TurnOnNotificationsScreen);
