import React, { Component } from 'react';
import { StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { sync as syncWallet } from '../actions/bitcoin/wallet';
import BtcBalanceLabelContainer from '../containers/BtcBalanceLabelContainer';
import TransactionListContainer from '../containers/TransactionListContainer';
import BaseScreen from './BaseScreen';

const SYNC_WALLET_INTERVAL = 60 * 1000 * 1; // 1 minute.

const styles = StyleSheet.create({
  navigationIcon: {
    fontSize: 28,
    color: '#C0D2F3',
    padding: 10
  },
  balanceLabel: {
    color: '#C0D2F3',
    padding: 10
  },
  view: {
    padding: 0
  }
});

@connect()
export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: '#26203D'
    },
    headerLeft: (
      <TouchableOpacity onPress={() => { navigation.navigate('Settings'); }}>
        <Icon name='ios-settings' style={styles.navigationIcon} />
      </TouchableOpacity>
    ),
    headerRight: (
      <BtcBalanceLabelContainer style={styles.balanceLabel} />
    )
  });

  componentDidMount() {
    const dispatch = this.props.dispatch;

    // Sync wallet with an interval.
    this._syncInterval = setInterval(() => {
      dispatch(syncWallet());
    }, SYNC_WALLET_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._syncInterval);
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <StatusBar barStyle='light-content' />
        <TransactionListContainer />
      </BaseScreen>
    );
  }
}

HomeScreen.propTypes = {
  dispatch: PropTypes.func
};
