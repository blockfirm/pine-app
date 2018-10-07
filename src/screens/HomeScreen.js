import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import { sync as syncWallet } from '../actions/bitcoin/wallet';
import TransactionsScreen from './TransactionsScreen';

const SYNC_WALLET_INTERVAL = 60 * 1000 * 1; // 1 minute.

@connect()
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

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
      <Swiper
        ref={(ref) => { this._swiper = ref; }}
        index={0}
        loop={false}
        showsPagination={false}
        scrollEventThrottle={16}
      >
        <TransactionsScreen />
      </Swiper>
    );
  }
}

HomeScreen.propTypes = {
  dispatch: PropTypes.func
};
