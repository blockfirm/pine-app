import React, { Component } from 'react';
import { StatusBar, NetInfo, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sync as syncWallet } from '../actions/bitcoin/wallet';
import TransactionsScreen from './TransactionsScreen';
import CameraScreen from './CameraScreen';
import ReceiveScreen from './ReceiveScreen';

const SYNC_WALLET_INTERVAL = 60 * 1000 * 1; // 1 minute.
const DEFAULT_SCREEN_INDEX = 1;

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: 'stretch'
  },
  screen: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT
  }
});

@connect()
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    activeIndex: DEFAULT_SCREEN_INDEX,
    scrollingToIndex: DEFAULT_SCREEN_INDEX
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;

    StatusBar.setBarStyle('dark-content');

    // Sync wallet with an interval.
    this._syncInterval = setInterval(() => {
      NetInfo.isConnected.fetch().then((isConnected) => {
        // Only sync if connected to the internet.
        if (isConnected) {
          dispatch(syncWallet());
        }
      });
    }, SYNC_WALLET_INTERVAL);

    // Listen for internet connection changes and sync when online.
    NetInfo.isConnected.addEventListener('connectionChange', this._onConnectionChange.bind(this));
  }

  componentWillUnmount() {
    clearInterval(this._syncInterval);
    NetInfo.isConnected.removeEventListener('connectionChange', this._onConnectionChange);
  }

  _onConnectionChange(isConnected) {
    const dispatch = this.props.dispatch;

    if (isConnected) {
      dispatch(syncWallet());
    }
  }

  _onIndexChanged(index) {
    const barStyle = index === 0 ? 'light-content' : 'dark-content';

    StatusBar.setBarStyle(barStyle);
    this.setState({ activeIndex: index });
  }

  _onMomentumScrollEnd(event) {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const activeIndex = Math.floor(contentOffset.x / layoutMeasurement.width);

    if (activeIndex !== this.state.activeIndex) {
      this._onIndexChanged(activeIndex);
    }
  }

  _onScroll(event) {
    const activeIndex = this.state.activeIndex;
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const previousOffsetX = layoutMeasurement.width * this.state.activeIndex;
    let scrollingToIndex;

    if (previousOffsetX > contentOffset.x) {
      scrollingToIndex = activeIndex - 1;
    } else if (previousOffsetX < contentOffset.x) {
      scrollingToIndex = activeIndex + 1;
    } else {
      scrollingToIndex = activeIndex;
    }

    this.setState({ scrollingToIndex });
  }

  _renderScreen({ item }) {
    return (
      <View style={styles.screen}>
        {item.screen}
      </View>
    );
  }

  _shouldShowCameraPreview() {
    const { activeIndex, scrollingToIndex } = this.state;
    const showCameraPreview = activeIndex === 0 || scrollingToIndex === 0;

    return showCameraPreview;
  }

  _scrollToHome() {
    this._flatList.scrollToIndex({
      animated: true,
      index: DEFAULT_SCREEN_INDEX
    });
  }

  render() {
    const showCameraPreview = this._shouldShowCameraPreview();

    const screens = [
      { key: 'camera', screen: <CameraScreen showPreview={showCameraPreview} onBackPress={this._scrollToHome.bind(this)} /> },
      { key: 'transactions', screen: <TransactionsScreen /> },
      { key: 'receive', screen: <ReceiveScreen /> }
    ];

    return (
      <FlatList
        ref={(flatList) => {
          this._flatList = flatList;
        }}
        bounces={false}
        getItemLayout={(data, index) => ({
          length: WINDOW_WIDTH,
          offset: WINDOW_WIDTH * index,
          index
        })}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        horizontal={true}
        style={styles.view}
        data={screens}
        renderItem={this._renderScreen}
        initialScrollIndex={DEFAULT_SCREEN_INDEX}
        onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
        onScroll={this._onScroll.bind(this)}
        scrollEventThrottle={16}
      />
    );
  }
}

HomeScreen.propTypes = {
  dispatch: PropTypes.func
};
