import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { navigateWithReset } from '../actions';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const windowDimensions = Dimensions.get('window');
const TITLE_MARGIN_BOTTOM = windowDimensions.height < 600 ? 20 : 30;

const styles = StyleSheet.create({
  title: {
    marginBottom: ifIphoneX(40, TITLE_MARGIN_BOTTOM)
  },
  subtitle: {
    fontSize: windowDimensions.height < 600 ? 12 : 14,
    textAlign: 'left'
  },
  terms: {
    alignItems: 'flex-start',
    marginBottom: ifIphoneX(40, 50)
  },
  paragraph: {
    fontSize: windowDimensions.height < 600 ? 12 : 14,
    textAlign: 'left'
  },
  link: {
    color: '#007AFF'
  }
});

@connect()
export default class DisclaimerScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _showHomeScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Home'));
  }

  _showTermsAndConditionsModal() {
    const navigation = this.props.navigation;
    navigation.navigate('TermsAndConditionsModal', { isModal: true });
  }

  _onUnderstand() {
    return this._showHomeScreen();
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <Title style={styles.title}>
          Read before you use Wallet ID
        </Title>

        <View style={styles.terms}>
          <Title style={styles.subtitle}>Key Access</Title>
          <Paragraph style={styles.paragraph}>
            Your private key stored with Wallet ID is stored securely on the device and only you can
            access it. No company or third party can access your key and it never leaves the device.
          </Paragraph>

          <Title style={styles.subtitle}>Key Recovery</Title>
          <Paragraph style={styles.paragraph}>
            Make sure to store your recovery key in a safe place. Anyone with access to the recovery
            key can access your funds. It is also the only way to recover your key in case you would
            lose or break your phone.
          </Paragraph>

          <Title style={styles.subtitle}>Terms and Conditions</Title>
          <Paragraph style={styles.paragraph}>
            <Text>By pressing "I understand", you understand and agree to the terms above as well as the </Text>
            <Text style={styles.link} onPress={this._showTermsAndConditionsModal.bind(this)}>Terms and Conditions</Text>
            <Text>.</Text>
          </Paragraph>
        </View>

        <Footer>
          <Button label='I understand' onPress={this._onUnderstand.bind(this)} />
        </Footer>
      </BaseScreen>
    );
  }
}

DisclaimerScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
