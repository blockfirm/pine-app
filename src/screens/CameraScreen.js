import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
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

@connect((state) => ({
  settings: state.settings
}))
export default class CameraScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _showEnterAmountScreen(address) {
    const navigation = this.props.navigation;
    const unit = this.props.settings.bitcoin.unit;

    navigation.navigate('Send', {
      address,
      unit
    });
  }

  _onReceivedAddress() {
    ReactNativeHaptic.generate('notificationSuccess');
    this._showEnterAmountScreen('');
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
  navigation: PropTypes.any,
  settings: PropTypes.object,
  showPreview: PropTypes.bool,
  onBackPress: PropTypes.func
};
