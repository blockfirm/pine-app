import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sync as syncWallet } from '../actions/bitcoin/wallet';
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

  _onRefresh() {
    const dispatch = this.props.dispatch;
    return dispatch(syncWallet());
  }

  render() {
    return (
      <TransactionList
        {...this.props}
        onRefresh={this._onRefresh.bind(this)}
      />
    );
  }
}

const TransactionListConnector = connect(
  mapStateToProps
)(TransactionListContainer);

export default TransactionListConnector;
