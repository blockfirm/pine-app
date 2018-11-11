/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StatusBar, NetInfo, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sync as syncWallet } from '../actions/bitcoin/wallet';
import Toolbar from '../components/toolbar/Toolbar';
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
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
  overlayCamera: {
    backgroundColor: 'black'
  },
  overlayHome: {
    backgroundColor: '#FEFEFE'
  },
  overlayReceive: {
    backgroundColor: '#FEFEFE',
    borderColor: 'gray',
    borderLeftWidth: StyleSheet.hairlineWidth
  }
});

@connect()
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    cameraOverlayOpacity: 1,
    homeOverlayOpacity: 0,
    receiveOverlayOpacity: 1,
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

  _setOverlayOpacities(event) {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;

    let cameraOverlayOpacity = this.state.cameraOverlayOpacity;
    let receiveOverlayOpacity = this.state.receiveOverlayOpacity;
    let homeOverlayOpacity = 0;

    if (contentOffset.x < layoutMeasurement.width) {
      cameraOverlayOpacity = 1 - (layoutMeasurement.width - contentOffset.x) / layoutMeasurement.width;
      homeOverlayOpacity = 1 - cameraOverlayOpacity;
    }

    if (contentOffset.x > layoutMeasurement.width) {
      receiveOverlayOpacity = 1 - (contentOffset.x - layoutMeasurement.width) / layoutMeasurement.width;
      homeOverlayOpacity = 1 - receiveOverlayOpacity;
    }

    this.setState({
      cameraOverlayOpacity,
      homeOverlayOpacity,
      receiveOverlayOpacity
    });
  }

  _setScrollingToIndex(event) {
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

  _onScroll(event) {
    this._setOverlayOpacities(event);
    this._setScrollingToIndex(event);

    this._contentOffsetX = event.nativeEvent.contentOffset.x;
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

  _onToolbarPress(index) {
    this._flatList.scrollToIndex({
      animated: true,
      index
    });
  }

  _renderScreen({ item }) {
    const overlayStyles = [
      styles.overlay
    ];

    switch (item.key) {
      case 'camera':
        overlayStyles.push(styles.overlayCamera);
        overlayStyles.push({ opacity: this.state.cameraOverlayOpacity });
        break;

      case 'home':
        overlayStyles.push(styles.overlayHome);
        overlayStyles.push({ opacity: this.state.homeOverlayOpacity });
        break;

      case 'receive':
        overlayStyles.push(styles.overlayReceive);
        overlayStyles.push({ opacity: this.state.receiveOverlayOpacity });
        break;
    }

    return (
      <View style={styles.screen}>
        {item.screen}
        <View style={overlayStyles} pointerEvents='none'></View>
      </View>
    );
  }

  render() {
    const showCameraPreview = this._shouldShowCameraPreview();

    const screens = [
      { key: 'camera', screen: <CameraScreen showPreview={showCameraPreview} onBackPress={this._scrollToHome.bind(this)} /> },
      { key: 'home', screen: <TransactionsScreen /> },
      { key: 'receive', screen: <ReceiveScreen onBackPress={this._scrollToHome.bind(this)} /> }
    ];

    return (
      <View style={styles.view}>
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
          renderItem={this._renderScreen.bind(this)}
          initialScrollIndex={DEFAULT_SCREEN_INDEX}
          onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
          onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={16}
        />
        <Toolbar
          onPress={this._onToolbarPress.bind(this)}
          contentOffsetX={this._contentOffsetX}
        />
      </View>
    );
  }
}

HomeScreen.propTypes = {
  dispatch: PropTypes.func
};
