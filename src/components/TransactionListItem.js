import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import TransactionIcon from './icons/TransactionIcon';
import StyledText from './StyledText';
import BtcLabel from './BtcLabel';
import DateLabel from './DateLabel';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white'
  },
  icon: {
    marginRight: 15,
    alignSelf: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1
  },
  dateLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: -0.1
  },
  rightContent: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  btcLabel: {
    alignSelf: 'flex-end',
    fontWeight: '600'
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

    if (confirmations > 5) {
      return amount < 0 ? TransactionIcon.TYPE_SEND_STAGE_3 : TransactionIcon.TYPE_RECEIVE_STAGE_3;
    } else if (confirmations > 0) {
      return amount < 0 ? TransactionIcon.TYPE_SEND_STAGE_2 : TransactionIcon.TYPE_RECEIVE_STAGE_2;
    }

    return amount < 0 ? TransactionIcon.TYPE_SEND_STAGE_1 : TransactionIcon.TYPE_RECEIVE_STAGE_1;
  }

  _getTitle(transaction, amount) {
    const confirmations = transaction.confirmations;

    if (!confirmations) {
      return amount < 0 ? 'Sending' : 'Receiving';
    }

    return amount < 0 ? 'Sent' : 'Received';
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
          <DateLabel date={date} style={styles.dateLabel} />
        </View>
        <View style={styles.rightContent}>
          <BtcLabel amount={amount} style={styles.btcLabel} />
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
