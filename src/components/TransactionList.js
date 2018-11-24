import React, { Component } from 'react';
import { StyleSheet, SectionList, View, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import moment from 'moment-timezone';

import TransactionListItemContainer from '../containers/TransactionListItemContainer';
import TransactionListEmptyContainer from '../containers/TransactionListEmptyContainer';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch'
  },
  sectionHeader: {
    backgroundColor: '#F6F6F6',
    marginTop: 30,
    marginBottom: 20,
    padding: 6,
    width: 87,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12
  },
  sectionHeaderText: {
    color: '#8A8A8F',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.07
  }
});

export default class TransactionList extends Component {
  state = {
    refreshing: false
  }

  _onRefreshFinished() {
    /**
     * Wait 1s before hiding the spinner. This is to make it
     * more clear to the user that the refresh actually took
     * place.
     */
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1000);
  }

  _onRefresh() {
    this.setState({ refreshing: true });

    this.props.onRefresh()
      .then(() => {
        this._onRefreshFinished();
      })
      .catch(() => {
        this._onRefreshFinished();
      });
  }

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

  _renderEmptyList() {
    return (
      <TransactionListEmptyContainer />
    );
  }

  render() {
    const transactions = [...this.props.transactions].reverse();
    const sections = this._getSections(transactions);

    if (!transactions.length) {
      return this._renderEmptyList();
    }

    return (
      <SectionList
        style={styles.list}
        contentInset={{ bottom: ifIphoneX(124, 90) }}
        sections={sections}
        renderItem={({ item }) => (
          <TransactionListItemContainer transaction={item} />
        )}
        keyExtractor={(item) => item.txid}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <StyledText style={styles.sectionHeaderText}>{title}</StyledText>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
    );
  }
}

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired
};
