import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';
import getStatusBarHeight from '../utils/getStatusBarHeight';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
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
  },
  topGradient: {
    alignSelf: 'stretch',
    position: 'absolute',
    top: 0,
    width: windowWidth,
    height: getStatusBarHeight() + 10
  }
});

export default class QrCodeScanner extends Component {
  render() {
    return (
      <View style={styles.view}>
        <RNCamera style={styles.camera} onBarCodeRead={this.props.onScan}>
          <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.0)']} style={styles.topGradient} />
          <Image source={require('../images/QRViewport.png')} style={styles.viewport} />
        </RNCamera>
      </View>
    );
  }
}

QrCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired
};
