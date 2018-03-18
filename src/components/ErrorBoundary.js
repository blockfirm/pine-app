import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { handleError } from '../actions';
import ErrorModalContainer from '../containers/ErrorModalContainer';

export default class ErrorBoundary extends Component {
  componentDidCatch(error) {
    const dispatch = this.props.dispatch;
    dispatch(handleError(error));
  }

  render() {
    return (
      <View {...this.props}>
        {this.props.children}
        <ErrorModalContainer />
      </View>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func
};
