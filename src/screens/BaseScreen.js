import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import ErrorBoundary from '../components/ErrorBoundary';
import HeaderContainer from '../containers/HeaderContainer';

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
  render() {
    return (
      <ErrorBoundary {...this.props} style={[styles.view, this.props.style]}>
        <HeaderContainer
          backButtonIconStyle={this.props.backButtonIconStyle}
          title={this.props.headerTitle}
        />
        {this.props.children}
      </ErrorBoundary>
    );
  }
}

BaseScreen.propTypes = {
  style: PropTypes.any,
  backButtonIconStyle: PropTypes.any,
  headerTitle: PropTypes.string,
  children: PropTypes.node
};
