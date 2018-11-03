import React, { Component } from 'react';
import { StyleSheet, View, LayoutAnimation, NetInfo } from 'react-native';
import StyledText from '../components/StyledText';

const HEIGHT = 30;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'stretch',
    height: HEIGHT + 15
  },
  notice: {
    backgroundColor: '#FF3B30',
    height: HEIGHT,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#ffffff'
  }
});

export default class OfflineNotice extends Component {
  state = {
    isConnected: true
  }

  componentDidMount() {
    // Get initial internet connection status.
    NetInfo.isConnected.fetch().then(this._onConnectionChange.bind(this));

    // Listen for internet connection changes.
    NetInfo.isConnected.addEventListener('connectionChange', this._onConnectionChange.bind(this));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._onConnectionChange);
  }

  _onConnectionChange(isConnected) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ isConnected });
  }

  render() {
    const isConnected = this.state.isConnected;

    const containerStyles = [
      styles.container,
      isConnected ? { height: 0 } : null
    ];

    const noticeStyles = [
      styles.notice,
      isConnected ? { marginTop: -45 } : null
    ];

    return (
      <View style={containerStyles}>
        <View style={noticeStyles}>
          <StyledText style={styles.text}>
            No Internet Connection
          </StyledText>
        </View>
      </View>
    );
  }
}
