import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';

import getStatusBarHeight from '../../utils/getStatusBarHeight';
import getNavBarHeight from '../../utils/getNavBarHeight';
import { withTheme } from '../../contexts/theme';
import ErrorBoundary from '../../components/ErrorBoundary';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: getStatusBarHeight() + getNavBarHeight()
  },
  childrenWrapper: {
    paddingTop: 35
  }
});

class BaseSettingsScreen extends Component {
  render() {
    const { theme } = this.props;

    return (
      <ErrorBoundary {...this.props} style={[styles.view, theme.settingsBackground]}>
        <ScrollView>
          <View style={[styles.childrenWrapper, this.props.wrapperStyle]}>
            {this.props.children}
          </View>
        </ScrollView>
      </ErrorBoundary>
    );
  }
}

BaseSettingsScreen.propTypes = {
  children: PropTypes.node,
  wrapperStyle: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(BaseSettingsScreen);
