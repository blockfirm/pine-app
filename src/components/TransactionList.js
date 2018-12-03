import React, { Component } from 'react';
import { StyleSheet, SectionList, View, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import moment from 'moment-timezone';

import TransactionListItemContainer from '../containers/TransactionListItemContainer';
import TransactionListEmptyContainer from '../containers/TransactionListEmptyContainer';
import StyledText from './StyledText';

const SECTION_HEADER_HEIGHT = 26;
const SECTION_HEADER_MARGIN_TOP = 30;
const SECTION_HEADER_MARGIN_BOTTOM = 20;
const ITEM_HEIGHT = 68;

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch'
  },
  sectionHeader: {
    backgroundColor: '#F6F6F6',
    marginTop: SECTION_HEADER_MARGIN_TOP,
    marginBottom: SECTION_HEADER_MARGIN_BOTTOM,
    padding: 6,
    width: 87,
    height: SECTION_HEADER_HEIGHT,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SECTION_HEADER_HEIGHT / 2
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

  constructor() {
    super(...arguments);

    this._getItemLayout = sectionListGetItemLayout({
      getItemHeight: () => ITEM_HEIGHT,
      getSectionHeaderHeight: () => (
        SECTION_HEADER_HEIGHT + SECTION_HEADER_MARGIN_TOP + SECTION_HEADER_MARGIN_BOTTOM
      )
    });
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

  // eslint-disable-next-line max-statements
  _getSectionTitle(transaction) {
    if (!transaction.time) {
      return 'Pending';
    }

    const date = moment(new Date(transaction.time * 1000));
    const now = moment();
    const yesterday = moment().subtract(1, 'days');
    const lastWeek = moment().subtract(1, 'weeks');

    if (date.isSame(now, 'day')) {
      return 'Today';
    }

    if (date.isSame(yesterday, 'day')) {
      return 'Yesterday';
    }

    if (date.isSame(now, 'week')) {
      return moment.weekdays(date.weekday());
    }

    if (date.isSame(lastWeek, 'week')) {
      return 'Last Week';
    }

    if (date.isSame(now, 'year')) {
      return date.format('MMMM');
    }

    return date.format('MMMM, YYYY');
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

  scrollToTop() {
    if (this._list) {
      this._list.scrollToLocation({
        sectionIndex: 0,
        itemIndex: -1
      });
    }
  }

  render() {
    const transactions = [...this.props.transactions].reverse();
    const sections = this._getSections(transactions);

    if (!transactions.length) {
      return this._renderEmptyList();
    }

    return (
      <SectionList
        ref={(ref) => { this._list = ref; }}
        style={styles.list}
        contentInset={{ bottom: ifIphoneX(124, 90) }}
        sections={sections}
        renderItem={({ item }) => (
          <TransactionListItemContainer transaction={item} />
        )}
        keyExtractor={(item) => item.txid}
        getItemLayout={this._getItemLayout}
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
