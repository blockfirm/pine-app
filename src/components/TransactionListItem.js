import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import getTransactionAmount from '../crypto/bitcoin/getTransactionAmount';
import TransactionTitleContainer from '../containers/transaction/TransactionTitleContainer';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import TransactionIcon from './icons/TransactionIcon';
import RelativeDateLabel from './RelativeDateLabel';

const styles = StyleSheet.create({
  item: {
    height: 68,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    padding: 16.5,
    backgroundColor: 'white'
  },
  icon: {
    marginRight: 16.5,
    alignSelf: 'center'
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20
  },
  dateLabel: {
    color: '#B1AFB7',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.05
  },
  rightContent: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  primaryCurrencyLabel: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: 'flex-end'
  },
  secondaryCurrencyLabel: {
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-end',
    color: '#B1AFB7'
  }
});

export default class TransactionListItem extends Component {
  _getAmount() {
    const { transaction, externalAddresses, internalAddresses } = this.props;
    return getTransactionAmount(transaction, externalAddresses, internalAddresses);
  }

  _getIconType(transaction, amount) {
    const confirmations = transaction.confirmations;

    if (confirmations) {
      return amount < 0 ? TransactionIcon.TYPE_SENT : TransactionIcon.TYPE_RECEIVED;
    }

    return amount < 0 ? TransactionIcon.TYPE_SENDING : TransactionIcon.TYPE_RECEIVING;
  }

  render() {
    const transaction = this.props.transaction;
    const date = transaction.time ? new Date(transaction.time * 1000) : new Date();
    const amount = this._getAmount();
    const transactionIconType = this._getIconType(transaction, amount);

    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.item}>
        <TransactionIcon style={styles.icon} type={transactionIconType} />
        <View>
          <TransactionTitleContainer transaction={transaction} style={styles.title} />
          <RelativeDateLabel date={date} style={styles.dateLabel} />
        </View>
        <View style={styles.rightContent}>
          <CurrencyLabelContainer amountBtc={amount} currencyType='primary' style={styles.primaryCurrencyLabel} />
          <CurrencyLabelContainer amountBtc={amount} currencyType='secondary' style={styles.secondaryCurrencyLabel} />
        </View>
      </TouchableOpacity>
    );
  }
}

TransactionListItem.propTypes = {
  transaction: PropTypes.object.isRequired,
  externalAddresses: PropTypes.object,
  internalAddresses: PropTypes.object,
  onPress: PropTypes.func
};
