import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TransactionList from '../components/TransactionList';

const mapStateToProps = (state) => {
  return {
    transactions: state.bitcoin.wallet.transactions.items || []
  };
};

class TransactionListContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  render() {
    return (
      <TransactionList {...this.props} />
    );
  }
}

const TransactionListConnector = connect(
  mapStateToProps
)(TransactionListContainer);

export default TransactionListConnector;
