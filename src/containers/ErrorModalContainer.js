import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { dismiss as dismissError } from '../actions/error';
import ErrorModal from '../components/ErrorModal';

const mapStateToProps = (state) => {
  return {
    error: state.error
  };
};

class ErrorModalContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  _onDismiss() {
    const dispatch = this.props.dispatch;
    dispatch(dismissError());
  }

  render() {
    return (
      <ErrorModal
        {...this.props}
        onDismiss={this._onDismiss.bind(this)}
      />
    );
  }
}

const ErrorModalConnector = connect(
  mapStateToProps
)(ErrorModalContainer);

export default ErrorModalConnector;
