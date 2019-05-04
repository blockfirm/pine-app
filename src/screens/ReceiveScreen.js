import React, { Component } from 'react';
import { StyleSheet, Clipboard, Share, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

import BaseScreen from './BaseScreen';
import { parse as parseAddress, resolveBaseUrl } from '../pineApi/address';
import ReceiveScreenHeader from '../components/ReceiveScreenHeader';
import ContentView from '../components/ContentView';
import Paragraph from '../components/Paragraph';
import AddressLabel from '../components/AddressLabel';

const AVATAR_PLACEHOLDER = require('../images/AvatarPlaceholder.png');

const WINDOW_WIDTH = Dimensions.get('window').width;
const QR_CODE_WIDTH = WINDOW_WIDTH - 80 - 32;

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  text: {
    textAlign: 'center',
    marginBottom: 0
  },
  pineAddress: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginBottom: 15
  },
  address: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginTop: 15
  }
});

@connect((state) => ({
  avatar: state.settings.user.profile.avatar,
  pineAddress: state.settings.user.profile.address,
  address: state.bitcoin.wallet.addresses.external.unused
}))
export default class ReceiveScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _getBitcoinUri() {
    const { pineAddress, address } = this.props;
    return `bitcoin:${address}?pine=${pineAddress}`;
  }

  _getAvatarSource() {
    const { pineAddress, avatar } = this.props;

    if (!avatar) {
      return AVATAR_PLACEHOLDER;
    }

    const { username, hostname } = parseAddress(pineAddress);
    const baseUrl = resolveBaseUrl(hostname);
    const uri = `${baseUrl}/v1/users/${username}/avatar?byUsername=1&c=${avatar.checksum}`;

    return { uri };
  }

  _shareAddress() {
    const bitcoinUri = this._getBitcoinUri();
    Share.share({ message: bitcoinUri });
  }

  render() {
    const { pineAddress, address } = this.props;
    const qrData = this._getBitcoinUri();

    return (
      <BaseScreen style={styles.view}>
        <ReceiveScreenHeader onSharePress={this._shareAddress.bind(this)} onBackPress={this.props.onBackPress} />
        <ContentView hasToolbar={true}>
          <Paragraph style={styles.text}>
            Show this QR code or share your address with someone who should send you bitcoin.
          </Paragraph>

          <View>
            <AddressLabel address={pineAddress} shorten={false} textStyle={styles.pineAddress} tooltipArrowDirection='down' />
            <QRCode
              value={qrData}
              size={QR_CODE_WIDTH}
              logo={this._getAvatarSource()}
              logoSize={80}
              logoBorderRadius={40}
              color='#111111'
            />
            <AddressLabel address={address} textStyle={styles.address} tooltipArrowDirection='up' />
          </View>

          <View>{/* Used as a placeholder so that the QR code view aligns in the center */ }</View>
        </ContentView>
      </BaseScreen>
    );
  }
}

ReceiveScreen.propTypes = {
  dispatch: PropTypes.func,
  avatar: PropTypes.shape({
    checksum: PropTypes.string
  }),
  pineAddress: PropTypes.string,
  address: PropTypes.string,
  onBackPress: PropTypes.func
};
