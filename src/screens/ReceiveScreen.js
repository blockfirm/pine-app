import React, { Component } from 'react';
import { StyleSheet, Clipboard, Share } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-qr-code';
import ReactNativeHaptic from 'react-native-haptic';

import BaseScreen from './BaseScreen';
import ReceiveScreenHeader from '../components/ReceiveScreenHeader';
import Footer from '../components/Footer';
import Button from '../components/Button';

const styles = StyleSheet.create({
  view: {
    padding: 0
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

        <QRCode value={qrData} size={200} />

        <Footer hasToolbar={true}>
          <Button
            label={label}
            onPress={this._copyAddress.bind(this)}
          />
        </Footer>
      </BaseScreen>
    );
  }
}

ReceiveScreen.propTypes = {
  dispatch: PropTypes.func,
  address: PropTypes.string,
  onBackPress: PropTypes.func
};
