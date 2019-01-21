import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../../styles/headerStyles';
import TransactionTitleContainer from '../../containers/transaction/TransactionTitleContainer';
import RelativeDateLabel from '../RelativeDateLabel';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center'
  },
  subTitle: {
    textAlign: 'center',
    color: '#B1AFB7',
    fontSize: 13,
    fontWeight: '500'
  }
});

export default class TransactionDetailsHeaderTitle extends Component {
  render() {
    const { transaction } = this.props;
    const date = transaction.time ? new Date(transaction.time * 1000) : new Date();

    return (
      <View>
        <TransactionTitleContainer transaction={transaction} showAmount={true} style={[headerStyles.title, styles.title]} />
        <RelativeDateLabel date={date} style={[headerStyles.title, styles.subTitle]} />
      </View>
    );
  }
}

TransactionDetailsHeaderTitle.propTypes = {
  transaction: PropTypes.object.isRequired
};
