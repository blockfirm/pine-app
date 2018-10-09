import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import { sync as syncWallet } from '../actions/bitcoin/wallet';
import TransactionsScreen from './TransactionsScreen';
import CameraScreen from './CameraScreen';

const SYNC_WALLET_INTERVAL = 60 * 1000 * 1; // 1 minute.

@connect()
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;

    StatusBar.setBarStyle('dark-content');

    // Sync wallet with an interval.
    this._syncInterval = setInterval(() => {
      dispatch(syncWallet());
    }, SYNC_WALLET_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._syncInterval);
  }

  _onIndexChanged(index) {
    const barStyle = index === 0 ? 'light-content' : 'dark-content';
    StatusBar.setBarStyle(barStyle);
  }

  render() {
    return (
      <Swiper
        index={1}
        loop={false}
        showsPagination={false}
        onIndexChanged={this._onIndexChanged.bind(this)}
      >
        <CameraScreen />
        <TransactionsScreen />
      </Swiper>
    );
  }
}

HomeScreen.propTypes = {
  dispatch: PropTypes.func
};
