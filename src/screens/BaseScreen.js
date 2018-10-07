import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import ErrorBoundary from '../components/ErrorBoundary';
import BackHeaderContainer from '../containers/BackHeaderContainer';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 40
  }
});

export default class BaseScreen extends Component {
  renderHeader() {
    if (this.props.hideHeader) {
      return null;
    }

    return (
      <BackHeaderContainer
        backButtonIconStyle={this.props.backButtonIconStyle}
        title={this.props.headerTitle}
      />
    );
  }

  render() {
    return (
      <ErrorBoundary {...this.props} style={[styles.view, this.props.style]}>
        {this.renderHeader()}
        {this.props.children}
      </ErrorBoundary>
    );
  }
}

BaseScreen.propTypes = {
  style: PropTypes.any,
  backButtonIconStyle: PropTypes.any,
  headerTitle: PropTypes.string,
  hideHeader: PropTypes.bool,
  children: PropTypes.node
};
