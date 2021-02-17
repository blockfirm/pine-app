/* eslint-disable max-lines */
import React, { Component } from 'react';
import { AppState, StyleSheet, View, Image, Dimensions, Linking, Clipboard, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { RNCamera } from 'react-native-camera';

import * as azteco from '../vendors/azteco';
import getPaymentInfoFromString from '../crypto/bitcoin/getPaymentInfoFromString';
import { parse as parseAddress, getAddressFromUri } from '../clients/paymentServer/address';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import ContentView from '../components/ContentView';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import VibrancyButton from '../components/VibrancyButton';
import Link from '../components/Link';

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
  topGradient: {
    alignSelf: 'stretch',
    position: 'absolute',
    top: 0,
    width: WINDOW_WIDTH,
    height: getStatusBarHeight() + 10
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  text: {
    maxWidth: 200,
    color: 'white',
    textAlign: 'center',
    marginBottom: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -0.1, height: 0.1 },
    textShadowRadius: 1
  },
  viewport: {
    width: 212,
    height: 212
  }
});

const getLightningPaymentRequest = (data, network) => {
  const networkPrefixMap = {
    mainnet: 'lnbc',
    testnet: 'lntb',
    regtest: 'lnbcrt'
  };

  const expectedPrefix = networkPrefixMap[network];
  const paymentRequest = data.replace(/^lightning:/i, '');

  if (paymentRequest.toLowerCase().startsWith(expectedPrefix)) {
    return paymentRequest;
  }
};

export default class QrCodeScanner extends Component {
  state = {
    cameraReady: false,
    copiedAddress: null
  }

  constructor() {
    super(...arguments);
    this._onAppStateChange = this._onAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._onAppStateChange);
    this._onAppStateChange('active');
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  async _onAppStateChange(appState) {
    if (appState === 'active') {
      try {
        const copiedAddress = await this._getAddressFromClipboard();
        this.setState({ copiedAddress });
      } catch (error) {
        this.setState({ copiedAddress: null });
      }
    }
  }

  async _getAddressFromClipboard() {
    const copiedString = await Clipboard.getString();
    const { network } = this.props;
    const pineAddress = getAddressFromUri(copiedString);
    const paymentInfo = getPaymentInfoFromString(copiedString, network);
    const lightningPaymentRequest = getLightningPaymentRequest(copiedString, network);

    if (lightningPaymentRequest) {
      // Copied string is a lightning payment request.
      return lightningPaymentRequest;
    }

    if (paymentInfo) {
      // Copied string is a BIP21 URI or bitcoin address.
      return pineAddress || paymentInfo.address;
    }

    // Try to evaluate copied string as a Pine address.
    try {
      parseAddress(copiedString);
      return copiedString.trim();
    } catch (error) {
      return null;
    }
  }

  // eslint-disable-next-line max-statements
  _onReceiveData(data, fromCamera) {
    const { network, onReceiveAddress, onReceiveLightningPaymentRequest, onRedeemAzteco } = this.props;

    if (!data || typeof data !== 'string') {
      if (!fromCamera) {
        Alert.alert(
          'No Address Copied',
          'Make sure that you copied an address and try again.',
          [{ text: 'OK', style: 'cancel' }],
          { cancelable: false }
        );
      }

      return;
    }

    // Check if the data is a lightning payment request.
    const lightningPaymentRequest = getLightningPaymentRequest(data, network);

    if (lightningPaymentRequest) {
      return onReceiveLightningPaymentRequest(lightningPaymentRequest, fromCamera);
    }

    if (azteco.isAztecoUrl(data)) {
      const voucher = azteco.parseAztecoUrl(data);
      return onRedeemAzteco(voucher);
    }

    const pineAddress = getAddressFromUri(data);
    const paymentInfo = getPaymentInfoFromString(data, network);

    if (paymentInfo) {
      // Data is a BIP21 URI or bitcoin address.
      return onReceiveAddress(pineAddress || paymentInfo.address, paymentInfo.amount, fromCamera);
    }

    // Try to evaluate data as a Pine address.
    try {
      parseAddress(data);
      return onReceiveAddress(data.trim(), fromCamera);
    } catch (error) {
      if (!fromCamera) {
        Alert.alert(
          'Invalid Address',
          'Make sure that you copied the correct address and try again.',
          [{ text: 'OK', style: 'cancel' }],
          { cancelable: false }
        );
      }
    }
  }

  _onPaste() {
    Clipboard.getString().then(this._onReceiveData.bind(this));
  }

  _onBarCodeRead({ data }) {
    const fromCamera = true;
    this._onReceiveData(data, fromCamera);
  }

  _goToAppSettings() {
    Linking.openURL('app-settings:');
  }

  _onCameraReady() {
    this.setState({
      cameraReady: true
    });
  }

  _renderViewport(cameraAuthorized) {
    if (cameraAuthorized) {
      return <Image source={require('../images/QRViewport.png')} style={styles.viewport} />;
    }

    return <Link onPress={this._goToAppSettings.bind(this)}>Enable Camera Access</Link>;
  }

  _renderButton(cameraAuthorized) {
    const { copiedAddress } = this.state;
    const subtitle = copiedAddress || 'Nothing to Paste';
    const disabled = !copiedAddress;

    if (cameraAuthorized) {
      return (
        <VibrancyButton
          label='Paste'
          subtitle={subtitle}
          disabled={disabled}
          onPress={this._onPaste.bind(this)}
        />
      );
    }

    return (
      <Button
        label='Paste Address'
        subtitle={subtitle}
        disabled={disabled}
        onPress={this._onPaste.bind(this)}
      />
    );
  }

  _renderCameraContent(cameraAuthorized) {
    return (
      <View style={styles.view}>
        <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.0)']} style={styles.topGradient} />

        <ContentView hasToolbar={true} style={styles.content}>
          <Paragraph style={styles.text}>
            Scan a QR code to send or receive bitcoin.
          </Paragraph>

          { this._renderViewport(cameraAuthorized) }
          { this._renderButton(cameraAuthorized) }
        </ContentView>
      </View>
    );
  }

  _renderCameraNotAuthorized() {
    return this._renderCameraContent(false);
  }

  _renderCameraAuthorized() {
    if (!this.state.cameraReady) {
      return;
    }

    return this._renderCameraContent(true);
  }

  render() {
    if (!this.props.showPreview) {
      return this._renderCameraContent(true);
    }

    return (
      <View style={styles.view}>
        <RNCamera
          ref={(ref) => {
            this._camera = ref;
          }}
          style={styles.camera}
          onCameraReady={this._onCameraReady.bind(this)}
          notAuthorizedView={this._renderCameraNotAuthorized()}
          pendingAuthorizationView={<View />}
          onBarCodeRead={this._onBarCodeRead.bind(this)}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          captureAudio={false}
        />
        { this._renderCameraAuthorized() }
      </View>
    );
  }
}

QrCodeScanner.propTypes = {
  onReceiveAddress: PropTypes.func.isRequired,
  onReceiveLightningPaymentRequest: PropTypes.func.isRequired,
  onRedeemAzteco: PropTypes.func.isRequired,
  showPreview: PropTypes.bool,
  network: PropTypes.string
};
