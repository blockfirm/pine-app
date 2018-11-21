import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactNativeHaptic from 'react-native-haptic';

import QrCodeScannerContainer from '../containers/QrCodeScannerContainer';
import CameraScreenHeader from '../components/CameraScreenHeader';
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

  _showEnterAmountScreen(address, amount) {
    const navigation = this.props.navigation;
    const unit = this.props.settings.bitcoin.unit;

    navigation.navigate('Send', {
      address,
      amount, // Amount in BTC.
      unit // Unit to display the amount in.
    });
  }

  _onReceiveAddress(address, amount) {
    ReactNativeHaptic.generate('notificationSuccess');
    this._showEnterAmountScreen(address, amount);
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <QrCodeScannerContainer showPreview={this.props.showPreview} onReceiveAddress={this._onReceiveAddress.bind(this)} />
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
