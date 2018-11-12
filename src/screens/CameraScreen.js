import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ReactNativeHaptic from 'react-native-haptic';

import CameraScreenHeader from '../components/CameraScreenHeader';
import QrCodeScanner from '../components/QrCodeScanner';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0,
    backgroundColor: 'black'
  }
});

export default class CameraScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _onReceivedAddress() {
    ReactNativeHaptic.generate('notificationSuccess');
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <QrCodeScanner showPreview={this.props.showPreview} onReceivedAddress={this._onReceivedAddress.bind(this)} />
        <CameraScreenHeader onBackPress={this.props.onBackPress} />
      </BaseScreen>
    );
  }
}

CameraScreen.propTypes = {
  showPreview: PropTypes.bool,
  onBackPress: PropTypes.func
};
