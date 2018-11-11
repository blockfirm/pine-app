import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';

import Link from '../components/Link';
import getStatusBarHeight from '../utils/getStatusBarHeight';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    position: 'absolute',
    backgroundColor: '#000000'
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
    width: WINDOW_WIDTH,
    height: getStatusBarHeight() + 10
  }
});

export default class QrCodeScanner extends Component {
  state = {
    cameraReady: false
  }

  shouldComponentUpdate(nextProps) {
    if (!this.state.cameraReady) {
      return true;
    }

    if (nextProps.showPreview === this.props.showPreview) {
      return true;
    }

    if (nextProps.showPreview) {
      this._camera.resumePreview();
    } else {
      this._camera.pausePreview();
    }

    return false;
  }

  _goToAppSettings() {
    Linking.openURL('app-settings:');
  }

  _onCameraReady() {
    this.setState({
      cameraReady: true
    });

    /*
     * HACK: Pausing the camera preview just after it's ready sometimes
     * makes the app freeze for a few seconds. Adding a 1s timeout seems
     * to be fixing this.
     */
    setTimeout(() => {
      if (!this.props.showPreview) {
        this._camera.pausePreview();
      }
    }, 1000);
  }

  _renderNotAuthorizedView() {
    return (
      <Link onPress={this._goToAppSettings.bind(this)}>Enable Camera Access</Link>
    );
  }

  _renderCameraContent() {
    if (!this.state.cameraReady) {
      return;
    }

    return (
      <View style={styles.view}>
        <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.0)']} style={styles.topGradient} />
        <Image source={require('../images/QRViewport.png')} style={styles.viewport} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.view}>
        <RNCamera
          ref={(ref) => {
            this._camera = ref;
          }}
          style={styles.camera}
          onCameraReady={this._onCameraReady.bind(this)}
          notAuthorizedView={this._renderNotAuthorizedView()}
          pendingAuthorizationView={<View />}
        />
        { this._renderCameraContent() }
      </View>
    );
  }
}

QrCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
  showPreview: PropTypes.bool
};
