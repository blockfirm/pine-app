import React, { Component } from 'react';
import { StyleSheet, View, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from '../components/StyledText';

const HEIGHT = 30;

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
  state = {};

  static getDerivedStateFromProps(props, state) {
    const isVisible = props.isDisconnectedFromInternet;

    if (isVisible !== state.isVisible) {
      LayoutAnimation.easeInEaseOut();
    }

    return { isVisible };
  }

  render() {
    const { theme } = this.props;
    const { isVisible } = this.state;

    const containerStyles = [
      styles.container,
      !isVisible ? styles.containerHidden : null
    ];

    const noticeStyles = [
      styles.notice,
      { backgroundColor: theme.offlineNoticeErrorColor },
      !isVisible ? styles.noticeHidden : null
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

OfflineNotice.propTypes = {
  isDisconnectedFromInternet: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(OfflineNotice);
