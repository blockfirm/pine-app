import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

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

  _onScan() {

  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <QrCodeScanner showPreview={this.props.showPreview} onScan={this._onScan.bind(this)} />
        <CameraScreenHeader onBackPress={this.props.onBackPress} />
      </BaseScreen>
    );
  }
}

CameraScreen.propTypes = {
  showPreview: PropTypes.bool,
  onBackPress: PropTypes.func
};
