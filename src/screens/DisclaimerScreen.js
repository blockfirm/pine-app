import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { navigateWithReset } from '../actions';
import * as settingsActions from '../actions/settings';
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
    textAlign: 'left',
    lineHeight: 21
  },
  link: {
    color: '#007AFF',
    lineHeight: 21
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
    navigation.navigate('TermsAndConditions', { isModal: true });
  }

  _flagAsAccepted() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      user: {
        hasAcceptedTerms: true
      }
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _onUnderstand() {
    this._flagAsAccepted();
    return this._showHomeScreen();
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <Title style={styles.title}>
          Read before you use Pine 🧐
        </Title>

        <View style={styles.terms}>
          <Title style={styles.subtitle}>Access to Funds</Title>
          <Paragraph style={styles.paragraph}>
            You are the only one who can access your funds as long as you keep your phone, iCloud account,
            and recovery key secure.
          </Paragraph>

          <Title style={styles.subtitle}>Wallet Recovery</Title>
          <Paragraph style={styles.paragraph}>
            The only way to recover a lost wallet is with the recovery key which is securely stored
            in your iCloud account. You can also do a manual backup under Settings. No one can recover
            lost funds for you if you lose your recovery key.
          </Paragraph>

          <Title style={styles.subtitle}>Terms and Conditions</Title>
          <Paragraph style={styles.paragraph}>
            <Text style={styles.paragraph}>By pressing "I understand", you understand and agree to the terms above as well as the </Text>
            <Text style={styles.link} onPress={this._showTermsAndConditionsModal.bind(this)}>Terms and Conditions</Text>
            <Text style={styles.paragraph}>.</Text>
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
