import React, { Component } from 'react';
import { StyleSheet, SectionList, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import TransactionListItemContainer from '../containers/TransactionListItemContainer';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#f0f1f4',
    marginLeft: 60
  },
  sectionHeader: {
    backgroundColor: '#F6F6F6',
    padding: 6
  },
  sectionHeaderText: {
    color: '#111111'
  }
});

export default class TransactionList extends Component {
  _getSectionTitle(transaction) {
    if (!transaction.time) {
      return 'Pending';
    }

    const date = new Date(transaction.time * 1000);
    const now = new Date();

    if (date.getFullYear() === now.getFullYear()) {
      return moment(date).format('MMMM');
    }

    return moment(date).format('MMMM, YYYY');
  }

  _getSections(transactions) {
    const sections = {};

    transactions.forEach((transaction) => {
      const title = this._getSectionTitle(transaction);

      if (!sections[title]) {
        sections[title] = [];
      }

      sections[title].push(transaction);
    });

    return Object.keys(sections).map((title) => ({
      title,
      data: sections[title]
    }));
  }

  render() {
    const transactions = this.props.transactions.reverse();
    const sections = this._getSections(transactions);

    return (
      <SectionList
        style={styles.list}
        sections={sections}
        renderItem={({ item }) => (
          <TransactionListItemContainer transaction={item} />
        )}
        keyExtractor={(item) => item.txid}
        ItemSeparatorComponent={({ highlighted }) => (
          <View style={[styles.separator, highlighted && { marginLeft: 0 }]} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <StyledText style={styles.sectionHeaderText}>{title}</StyledText>
          </View>
        )}
      />
    );
  }
}

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired
};
