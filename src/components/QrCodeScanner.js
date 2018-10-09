import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    position: 'absolute',
    top: 0,
    left: 0
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight,
    width: windowWidth
  },
  viewport: {
    width: 212,
    height: 212,
    position: 'absolute'
  }
});

export default class QrCodeScanner extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Camera style={styles.camera} onBarCodeRead={this.props.onScan}>
          <Image source={require('../images/qr-viewport.png')} style={styles.viewport} />
        </Camera>
      </View>
    );
  }
}

QrCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired
};
