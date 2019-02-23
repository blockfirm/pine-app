import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sync as syncApp } from '../actions/sync';
import TransactionList from '../components/TransactionList';

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts.items || {}
  };
};

class TransactionListContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  _onRefresh() {
    const dispatch = this.props.dispatch;
    return dispatch(syncApp());
  }

  scrollToTop() {
    this._transactionList.scrollToTop();
  }

  render() {
    return (
      <TransactionList
        {...this.props}
        ref={ref => { this._transactionList = ref; }}
        onRefresh={this._onRefresh.bind(this)}
      />
    );
  }
}

const TransactionListConnector = connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(TransactionListContainer);

export default TransactionListConnector;
