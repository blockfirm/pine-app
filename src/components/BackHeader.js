import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';
import headerStyles from '../styles/headerStyles';
import { withTheme } from '../contexts/theme';
import BackButton from './BackButton';

const styles = StyleSheet.create({
  header: {
    marginTop: getStatusBarHeight(),
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: getNavBarHeight(),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  title: {
    position: 'absolute',
    left: 40,
    right: 40,
    textAlign: 'center'
  }
});

class BackHeader extends Component {
  render() {
    const { showBackButton, theme } = this.props;

    return (
      <View style={styles.header}>
        { showBackButton ? <BackButton onPress={this.props.onBackPress} /> : null }

        <Text style={[headerStyles.title, theme.headerTitle, styles.title]}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

BackHeader.propTypes = {
  showBackButton: PropTypes.bool,
  onBackPress: PropTypes.func,
  title: PropTypes.string,
  theme: PropTypes.object
};

export default withTheme(BackHeader);
