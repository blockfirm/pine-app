/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactNativeHaptic from 'react-native-haptic';
import { Navigation } from 'react-native-navigation';
import bitcoin from 'bitcoinjs-lib';
import bip32 from 'bip32';
import bip39 from 'bip39';

import authentication from '../authentication';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { setHomeScreenIndex } from '../actions/setHomeScreenIndex';
import * as keyActions from '../actions/keys';
import { handle as handleError } from '../actions/error/handle';
import { create as createTransaction } from '../actions/bitcoin/wallet/transactions/create';
import { post as postTransaction } from '../actions/bitcoin/blockchain/transactions/post';
import { sync as syncWallet } from '../actions/bitcoin/wallet';
import headerStyles from '../styles/headerStyles';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ContentView from '../components/ContentView';
import StyledText from '../components/StyledText';
import AutoFontSize from '../components/AutoFontSize';
import BtcLabel from '../components/BtcLabel';
import UnitLabel from '../components/UnitLabel';
import AddressLabel from '../components/AddressLabel';
import FeeLabel from '../components/FeeLabel';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  amountContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    margin: 16
  },
  payTitle: {
    color: '#B1AFB7',
    fontSize: 17,
    letterSpacing: 0.07
  },
  amount: {
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: -0.1,
    color: '#262626'
  },
  amountUnit: {
    color: '#B1AFB7',
    fontSize: 17
  },
  details: {
    alignSelf: 'stretch',
    marginTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EFEEF0'
  },
  detail: {
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 0,
    marginLeft: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EFEEF0'
  },
  lastDetail: {
    borderBottomWidth: 0
  },
  label: {
    color: '#8A8A8F',
    fontSize: 15
  },
  valueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  value: {
    color: '#8A8A8F',
    fontSize: 15,
    position: 'absolute',
    right: 16,
    top: 16
  },
  bullet: {
    marginHorizontal: 10,
    height: 3,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#8A8A8F'
  },
  address: {
    fontSize: 14
  },
  errorText: {
    color: '#FF3B30'
  },
  bold: {
    fontWeight: '600',
    color: 'black'
  }
});

@connect()
export default class TransactionDetailsScreen extends Component {
  static options() {
    return {
      topBar: {
        visible: true
        //title: 'Transaction Details'
      }
    };
  }

  state = {

  }

  constructor() {
    super(...arguments);
    Navigation.events().bindComponent(this);
  }

  componentDidMount() {

  }

  render() {
    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <View style={styles.amountContainer}>
            <StyledText style={styles.payTitle}>SENT</StyledText>
            <View>
              <AutoFontSize margin={150}>

              </AutoFontSize>
            </View>
            <UnitLabel unit={'BTC'} style={styles.amountUnit} />
          </View>
          <View style={styles.details}>
            <View style={styles.detail}>
              <StyledText style={styles.label}>To</StyledText>

            </View>
            <View style={styles.detail}>
              <StyledText style={styles.label}>Fee</StyledText>

            </View>
            <View style={[styles.detail, styles.lastDetail]}>
              <StyledText style={[styles.label, styles.bold]}>You Pay</StyledText>

            </View>
          </View>
        </ContentView>
      </BaseScreen>
    );
  }
}

TransactionDetailsScreen.propTypes = {

};
