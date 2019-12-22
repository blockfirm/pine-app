import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactNativeHaptic from 'react-native-haptic';

import QrCodeScannerContainer from '../containers/QrCodeScannerContainer';
import CameraScreenHeader from '../components/CameraScreenHeader';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0,
    backgroundColor: 'black'
  }
});

@connect((state) => ({
  contacts: state.contacts.items,
  homeScreenIndex: state.navigate.homeScreen.index
}))
export default class CameraScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    pauseCamera: false
  }

  componentDidMount() {
    const { navigation } = this.props;

    this._willFocusListener = navigation.addListener('willFocus', this.componentWillFocus.bind(this));
    this._willBlurListener = navigation.addListener('willBlur', this.componentWillBlur.bind(this));
  }

  componentWillUnmount() {
    this._willFocusListener.remove();
    this._willBlurListener.remove();
  }

  componentWillFocus() {
    this.setState({ pauseCamera: false });

    if (this.props.homeScreenIndex === 0) {
      StatusBar.setBarStyle('light-content');
    }
  }

  componentWillBlur() {
    this.setState({ pauseCamera: true });

    if (this.props.homeScreenIndex === 0) {
      StatusBar.setBarStyle('default');
    }
  }

  _showAddContactScreen(address) {
    const { navigation } = this.props;
    navigation.navigate('AddContact', { address });
  }

  _showConversationScreen(contact, amount) {
    const { navigation } = this.props;
    const contactId = contact.id;
    const autoFocus = true;

    navigation.navigate('Conversation', { contactId, amount, autoFocus });
  }

  _showConversationScreenForAddress(bitcoinAddress, amount) {
    const { navigation } = this.props;
    const autoFocus = true;

    navigation.navigate('Conversation', { bitcoinAddress, amount, autoFocus });
  }

  _onReceiveAddress(address, amount, fromCamera) {
    const { contacts, navigation } = this.props;
    const showPreview = this.props.showPreview && !this.state.pauseCamera;
    const isFocused = navigation.isFocused();
    const isPineAddress = address.indexOf('@') > 0;

    if (!showPreview || !isFocused) {
      return;
    }

    if (fromCamera) {
      ReactNativeHaptic.generate('notificationSuccess');
    }

    const existingContact = Object.values(contacts).find((contact) => {
      return contact.address === address;
    })

    if (existingContact) {
      return this._showConversationScreen(existingContact, amount);
    }

    if (isPineAddress) {
      return this._showAddContactScreen(address);
    }

    return this._showConversationScreenForAddress(address, amount);
  }

  _onRedeemAzteco(voucher) {
    const { navigation } = this.props;
    const showPreview = this.props.showPreview && !this.state.pauseCamera;
    const isFocused = navigation.isFocused();

    if (!showPreview || !isFocused) {
      return;
    }

    navigation.navigate('RedeemAzteco', { voucher });
  }

  render() {
    const showPreview = this.props.showPreview && !this.state.pauseCamera;

    return (
      <BaseScreen style={styles.view}>
        <QrCodeScannerContainer
          showPreview={showPreview}
          onReceiveAddress={this._onReceiveAddress.bind(this)}
          onRedeemAzteco={this._onRedeemAzteco.bind(this)}
        />

        <CameraScreenHeader onBackPress={this.props.onBackPress} />
      </BaseScreen>
    );
  }
}

CameraScreen.propTypes = {
  navigation: PropTypes.any,
  contacts: PropTypes.object,
  showPreview: PropTypes.bool,
  onBackPress: PropTypes.func,
  homeScreenIndex: PropTypes.number
};
