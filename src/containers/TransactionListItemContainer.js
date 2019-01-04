import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { disableScroll } from '../actions';
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

  constructor() {
    super(...arguments);

    this._onPeekIn = this._onPeekIn.bind(this);
    this._onPeekOut = this._onPeekOut.bind(this);
  }

  _onPeekIn() {
    const { dispatch } = this.props;
    dispatch(disableScroll(true));
  }

  _onPeekOut() {
    const { dispatch } = this.props;
    dispatch(disableScroll(false));
  }

  render() {
    return (
      <TransactionListItem
        {...this.props}
        onPeekIn={this._onPeekIn}
        onPeekOut={this._onPeekOut}
      />
    );
  }
}

const TransactionListItemConnector = connect(
  mapStateToProps
)(TransactionListItemContainer);

export default TransactionListItemConnector;
