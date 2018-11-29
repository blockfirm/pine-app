/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StatusBar, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setHomeScreenIndex } from '../actions/setHomeScreenIndex';
import { sync as syncWallet } from '../actions/bitcoin/wallet';
import Toolbar from '../components/toolbar/Toolbar';
import TransactionsScreen from './TransactionsScreen';
import CameraScreen from './CameraScreen';
import ReceiveScreen from './ReceiveScreen';

const SYNC_WALLET_INTERVAL = 10 * 1000; // 10 seconds.
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

@connect((state) => ({
  homeScreenIndex: state.homeScreen.index,
  isDisconnectedFromInternet: state.network.internet.disconnected
}))
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
      // Only sync if connected to the internet.
      if (!this.props.isDisconnectedFromInternet) {
        dispatch(syncWallet());
      }
    }, SYNC_WALLET_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._syncInterval);
  }

  componentDidUpdate(prevProps) {
    const { homeScreenIndex } = this.props;

    /**
     * Scroll to the homeScreenIndex if modified externally.
     * This is used by the Send modal to make sure the transaction
     * view is shown after a successful payment.
     */
    if (homeScreenIndex !== undefined && homeScreenIndex !== this.state.activeIndex) {
      this.setState({ activeIndex: homeScreenIndex });

      this._flatList.scrollToIndex({
        animated: false,
        index: homeScreenIndex
      });
    }
  }

  _onIndexChanged(index) {
    const { dispatch } = this.props;
    const barStyle = index === 0 ? 'light-content' : 'dark-content';

    StatusBar.setBarStyle(barStyle);
    this.setState({ activeIndex: index });

    dispatch(setHomeScreenIndex(index));
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
    const { activeIndex } = this.state;

    this._flatList.scrollToIndex({
      animated: true,
      index
    });

    // Scroll to top if the transactions button is pressed while already on this screen.
    if (index === DEFAULT_SCREEN_INDEX && index === activeIndex) {
      this._transactionsScreen.scrollToTop();
    }
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
    const props = { navigation: this.props.navigation };

    const screens = [
      { key: 'camera', screen: <CameraScreen {...props} showPreview={showCameraPreview} onBackPress={this._scrollToHome.bind(this)} /> },
      { key: 'home', screen: <TransactionsScreen {...props} ref={ref => { this._transactionsScreen = ref && ref.getWrappedInstance(); }} /> },
      { key: 'receive', screen: <ReceiveScreen {...props} onBackPress={this._scrollToHome.bind(this)} /> }
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
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  isDisconnectedFromInternet: PropTypes.bool
};
