import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import TransactionListItem from '../components/TransactionListItem';

const mapStateToProps = (state) => {
  return {
    bitcoinNetwork: state.settings.bitcoin.network,
    externalAddresses: state.bitcoin.wallet.addresses.external.items,
    internalAddresses: state.bitcoin.wallet.addresses.internal.items
  };
};

class TransactionListItemContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.any,
    transaction: PropTypes.object.isRequired,
    bitcoinNetwork: PropTypes.string
  };

  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
    const { navigation, transaction, bitcoinNetwork } = this.props;
    navigation.navigate('TransactionDetails', { transaction, bitcoinNetwork });
  }

  render() {
    return (
      <TransactionListItem
        {...this.props}
        onPress={this._onPress}
      />
    );
  }
}

const TransactionListItemConnector = connect(
  mapStateToProps
)(TransactionListItemContainer);

export default withNavigation(TransactionListItemConnector);
