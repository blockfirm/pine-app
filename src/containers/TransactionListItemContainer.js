import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TransactionListItem from '../components/TransactionListItem';

const mapStateToProps = (state) => {
  return {
    externalAddresses: state.bitcoin.wallet.addresses.external.items,
    internalAddresses: state.bitcoin.wallet.addresses.internal.items
  };
};

class TransactionListItemContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    transaction: PropTypes.object.isRequired
  };

  render() {
    return (
      <TransactionListItem {...this.props} />
    );
  }
}

const TransactionListItemConnector = connect(
  mapStateToProps
)(TransactionListItemContainer);

export default TransactionListItemConnector;
