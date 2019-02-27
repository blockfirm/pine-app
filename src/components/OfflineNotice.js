import React, { Component } from 'react';
import { StyleSheet, View, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from '../components/StyledText';

const HEIGHT = 30;

const COLOR_ERROR = '#FF3B30';
const COLOR_WARNING = '#FF8D36';

const LABEL_DISCONNECTED_FROM_INTERNET = 'No Internet Connection 🤳';
const LABEL_DISCONNECTED_FROM_SERVER = 'Waiting for Network... 😴';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'stretch',
    height: HEIGHT
  },
  containerHidden: {
    height: 0
  },
  notice: {
    backgroundColor: COLOR_ERROR,
    height: HEIGHT,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noticeHidden: {
    marginTop: -45
  },
  text: {
    color: '#ffffff'
  }
});

export default class OfflineNotice extends Component {
  state = {
    isVisible: false,
    backgroundColor: COLOR_ERROR,
    label: LABEL_DISCONNECTED_FROM_INTERNET
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    let isVisible = false;
    let { backgroundColor, label } = this.state;

    if (nextProps.isDisconnectedFromInternet || nextProps.isDisconnectedFromServer || nextProps.isDisconnectedFromPineServer) {
      isVisible = true;
    }

    if (nextProps.isDisconnectedFromInternet) {
      backgroundColor = COLOR_ERROR;
      label = LABEL_DISCONNECTED_FROM_INTERNET;
    } else if (nextProps.isDisconnectedFromServer || nextProps.isDisconnectedFromPineServer) {
      backgroundColor = COLOR_WARNING;
      label = LABEL_DISCONNECTED_FROM_SERVER;
    }

    if (isVisible !== this.state.isVisible) {
      LayoutAnimation.easeInEaseOut();
    }

    this.setState({
      isVisible,
      backgroundColor,
      label
    });
  }

  render() {
    const {
      isVisible,
      backgroundColor,
      label
    } = this.state;

    const containerStyles = [
      styles.container,
      !isVisible ? styles.containerHidden : null
    ];

    const noticeStyles = [
      styles.notice,
      { backgroundColor },
      !isVisible ? styles.noticeHidden : null
    ];

    return (
      <View style={containerStyles}>
        <View style={noticeStyles}>
          <StyledText style={styles.text}>
            {label}
          </StyledText>
        </View>
      </View>
    );
  }
}

OfflineNotice.propTypes = {
  isDisconnectedFromInternet: PropTypes.bool,
  isDisconnectedFromServer: PropTypes.bool,
  isDisconnectedFromPineServer: PropTypes.bool
};
