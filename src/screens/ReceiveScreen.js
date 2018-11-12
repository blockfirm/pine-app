import React, { Component } from 'react';
import { StyleSheet, Clipboard, Share } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-qr-code';
import ReactNativeHaptic from 'react-native-haptic';

import BaseScreen from './BaseScreen';
import ReceiveScreenHeader from '../components/ReceiveScreenHeader';
import ContentView from '../components/ContentView';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  text: {
    textAlign: 'center',
    marginBottom: 0
  }
});

@connect((state) => ({
  address: state.bitcoin.wallet.addresses.external.unused
}))
export default class ReceiveScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    copied: false
  }

  _copyAddress() {
    const address = this.props.address;

    Clipboard.setString(address);
    ReactNativeHaptic.generate('notificationSuccess');
    this.setState({ copied: true });

    setTimeout(() => {
      this.setState({ copied: false });
    }, 1000);
  }

  _shareAddress() {
    const address = this.props.address;
    Share.share({ message: address });
  }

  render() {
    const address = this.props.address;
    const qrData = `bitcoin:${address}`;
    const label = this.state.copied ? 'Copied' : 'Copy Address';

    return (
      <BaseScreen style={styles.view}>
        <ReceiveScreenHeader onSharePress={this._shareAddress.bind(this)} onBackPress={this.props.onBackPress} />

        <ContentView hasToolbar={true}>
          <Paragraph style={styles.text}>
            Show this QR code or share your address with someone who should send you bitcoin.
          </Paragraph>

          <QRCode value={qrData} size={200} />

          <Button
            label={label}
            onPress={this._copyAddress.bind(this)}
          />
        </ContentView>
      </BaseScreen>
    );
  }
}

ReceiveScreen.propTypes = {
  dispatch: PropTypes.func,
  address: PropTypes.string,
  onBackPress: PropTypes.func
};
