import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import TransactionListEmpty from '../components/TransactionListEmpty';

const mapStateToProps = (state) => {
  return {
    address: state.bitcoin.wallet.addresses.external.unused
  };
};

class TransactionListEmptyContainer extends Component {
  static propTypes = {
    navigation: PropTypes.any
  };

  constructor() {
    super(...arguments);
    this._onAddContactPress = this._onAddContactPress.bind(this);
  }

  _onAddContactPress() {
    const { navigation } = this.props;
    navigation.navigate('AddContact');
  }

  render() {
    return (
      <TransactionListEmpty
        {...this.props}
        onAddContactPress={this._onAddContactPress}
      />
    );
  }
}

const TransactionListEmptyConnector = connect(
  mapStateToProps
)(TransactionListEmptyContainer);

export default withNavigation(TransactionListEmptyConnector);
