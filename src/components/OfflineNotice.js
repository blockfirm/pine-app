import React, { Component } from 'react';
import { StyleSheet, View, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from '../components/StyledText';

const HEIGHT = 30;

const LABEL_DISCONNECTED_FROM_INTERNET = 'No Internet Connection';
const LABEL_DISCONNECTED_FROM_SERVER = 'Waiting for Network...';

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

class OfflineNotice extends Component {
  state = {}

  static getDerivedStateFromProps(props, state) {
    const { theme } = props;
    let { backgroundColor, label } = state;
    let isVisible = false;

    if (props.isDisconnectedFromInternet) {
      isVisible = true;
      backgroundColor = theme.offlineNoticeErrorColor;
      label = LABEL_DISCONNECTED_FROM_INTERNET;
    } else if (props.isDisconnectedFromServer || props.isDisconnectedFromPineServer) {
      isVisible = true;
      backgroundColor = theme.offlineNoticeWarningColor;
      label = LABEL_DISCONNECTED_FROM_SERVER;
    }

    if (isVisible !== state.isVisible) {
      LayoutAnimation.easeInEaseOut();
    }

    return {
      isVisible,
      backgroundColor,
      label
    };
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
  isDisconnectedFromPineServer: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(OfflineNotice);
