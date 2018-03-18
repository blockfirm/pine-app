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
        <HeaderContainer backButtonIconStyle={this.props.backButtonIconStyle} />
        {this.props.children}
      </ErrorBoundary>
    );
  }
}

BaseScreen.propTypes = {
  style: PropTypes.any,
  backButtonIconStyle: PropTypes.any,
  children: PropTypes.node
};
