import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import TransactionIcon from './icons/TransactionIcon';
import StyledText from './StyledText';
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

const hasExternalWalletAddress = (vout, externalAddresses) => {
  return vout.scriptPubKey.addresses.some((address) => {
    return address in externalAddresses;
  });
};

const hasWalletAddress = (vout, externalAddresses, internalAddresses) => {
  return vout.scriptPubKey.addresses.some((address) => {
    return address in externalAddresses || address in internalAddresses;
  });
};

export default class TransactionListItem extends Component {
  _getAmount(transaction) {
    const { externalAddresses, internalAddresses } = this.props;

    const externalVouts = transaction.vout.filter((vout) => {
      return hasExternalWalletAddress(vout, externalAddresses);
    });

    if (externalVouts.length > 0) {
      const amount = externalVouts.reduce((sum, vout) => {
        return sum + vout.value;
      }, 0);

      return amount;
    }

    const recipientVouts = transaction.vout.filter((vout) => {
      return !hasWalletAddress(vout, externalAddresses, internalAddresses);
    });

    const amount = recipientVouts.reduce((sum, vout) => {
      return sum + vout.value;
    }, 0);

    return -amount;
  }

  _getIconType(transaction, amount) {
    const confirmations = transaction.confirmations;

    if (confirmations) {
      return amount < 0 ? TransactionIcon.TYPE_SENT : TransactionIcon.TYPE_RECEIVED;
    }

    return amount < 0 ? TransactionIcon.TYPE_SENDING : TransactionIcon.TYPE_RECEIVING;
  }

  _getTitle(transaction, amount) {
    const confirmations = transaction.confirmations;

    if (confirmations) {
      return amount < 0 ? 'Sent' : 'Received';
    }

    return amount < 0 ? 'Sending' : 'Receiving';
  }

  render() {
    const transaction = this.props.transaction;
    const date = transaction.time ? new Date(transaction.time * 1000) : new Date();
    const amount = this._getAmount(transaction);
    const title = this._getTitle(transaction, amount);
    const transactionIconType = this._getIconType(transaction, amount);

    return (
      <View style={styles.item}>
        <TransactionIcon style={styles.icon} type={transactionIconType} />
        <View>
          <StyledText style={styles.title}>{title}</StyledText>
          <RelativeDateLabel date={date} style={styles.dateLabel} />
        </View>
        <View style={styles.rightContent}>
          <CurrencyLabelContainer amountBtc={amount} currencyType='primary' style={styles.primaryCurrencyLabel} />
          <CurrencyLabelContainer amountBtc={amount} currencyType='secondary' style={styles.secondaryCurrencyLabel} />
        </View>
      </View>
    );
  }
}

TransactionListItem.propTypes = {
  transaction: PropTypes.object.isRequired,
  externalAddresses: PropTypes.object,
  internalAddresses: PropTypes.object
};
