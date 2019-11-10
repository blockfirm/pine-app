import React, { Component } from 'react';
import { StyleSheet, Clipboard, Share, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

import BaseScreen from './BaseScreen';
import ReceiveScreenHeader from '../components/ReceiveScreenHeader';
import ContentView from '../components/ContentView';
import Paragraph from '../components/Paragraph';
import AddressLabel from '../components/AddressLabel';
import Avatar from '../components/Avatar';

const WINDOW_WIDTH = Dimensions.get('window').width;
const QR_CODE_WIDTH = WINDOW_WIDTH - 150;
const AVATAR_WIDTH = Math.floor(QR_CODE_WIDTH / 4);

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
    marginBottom: 15,
    fontWeight: '600'
  },
  address: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginTop: 15
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrAvatar: {
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'absolute'
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

  _shareAddress() {
    const bitcoinUri = this._getBitcoinUri();
    Share.share({ message: bitcoinUri });
  }

  render() {
    const { pineAddress, address, avatar } = this.props;
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
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrData}
                size={QR_CODE_WIDTH}
                color='#111111'
              />
              <Avatar
                size={AVATAR_WIDTH}
                pineAddress={pineAddress}
                checksum={avatar && avatar.checksum}
                style={styles.qrAvatar}
              />
            </View>
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
