import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-qr-code';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
  }
});

@connect((state) => ({
  address: state.bitcoin.wallet.addresses.external.unused
}))
export default class ReceiveScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const address = this.props.address;
    const qrData = `bitcoin:${address}`;

    return (
      <BaseScreen style={styles.view}>
        <QRCode value={qrData} size={200} />
      </BaseScreen>
    );
  }
}

ReceiveScreen.propTypes = {
  dispatch: PropTypes.func,
  address: PropTypes.string
};
