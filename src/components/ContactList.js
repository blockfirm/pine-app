import React, { PureComponent } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

import ContactListItemContainer from '../containers/ContactListItemContainer';
import ContactListEmptyContainer from '../containers/ContactListEmptyContainer';
import DateSectionList from './DateSectionList';

import {
  SECTION_HEADER_HEIGHT,
  SECTION_HEADER_MARGIN_TOP,
  SECTION_HEADER_MARGIN_BOTTOM
} from './DateSectionHeader';

const ITEM_HEIGHT = 68;
const CONTENT_INSET_BOTTOM = ifIphoneX(124, 90);

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch'
  },
  emptyContentContainer: {
    flexGrow: 1,
    marginBottom: CONTENT_INSET_BOTTOM
  }
});

const getTimestampFromContact = (contact) => {
  if (contact.lastMessage) {
    return contact.lastMessage.createdAt;
  }

  if (contact.contactRequest) {
    return contact.contactRequest.createdAt;
  }

  return contact.createdAt;
};

export default class ContactList extends PureComponent {
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
     * Wait 0.5s before hiding the spinner. This is to make it
     * more clear to the user that the refresh actually took
     * place.
     */
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 500);
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

  scrollToTop() {
    const listLength = Object.keys(this.props.contacts).length;

    if (this._list && listLength > 0) {
      this._list.scrollToTop();
    }
  }

  render() {
    const contacts = Object.values(this.props.contacts);
    const contentContainerStyle = !contacts.length ? styles.emptyContentContainer : null;

    contacts.sort((a, b) => {
      return getTimestampFromContact(b) - getTimestampFromContact(a);
    });

    return (
      <DateSectionList
        ref={(ref) => { this._list = ref; }}
        style={styles.list}
        contentContainerStyle={contentContainerStyle}
        contentInset={{ bottom: CONTENT_INSET_BOTTOM }}
        data={contacts}
        renderItem={({ item }) => (
          <ContactListItemContainer contact={item} />
        )}
        keyExtractor={(item) => item.id}
        timestampExtractor={getTimestampFromContact}
        getItemLayout={this._getItemLayout}
        ListEmptyComponent={ContactListEmptyContainer}
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

ContactList.propTypes = {
  contacts: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired
};
