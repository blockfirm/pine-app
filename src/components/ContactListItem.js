/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import {
  default as CurrencyLabelContainer,
  CURRENCY_TYPE_PRIMARY
} from '../containers/CurrencyLabelContainer';

import vendors from '../vendors';
import MessageIndicatorContainer from '../containers/indicators/MessageIndicatorContainer';
import { withTheme } from '../contexts/theme';
import Bullet from './typography/Bullet';
import Avatar from './Avatar';
import StyledText from './StyledText';
import RelativeDateLabelShort from './RelativeDateLabelShort';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  avatarWrapper: {
    marginRight: 13,
    alignSelf: 'center'
  },
  titleWrapper: {
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 7
  },
  subtitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  subtitle: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '400'
  },
  subtitleUnread: {
    fontWeight: '600'
  },
  bullet: {
    marginHorizontal: 5,
    height: 2,
    width: 2,
    borderRadius: 1
  },
  relativeDate: {
    fontSize: 14,
    fontWeight: '400'
  },
  indicator: {
    marginRight: 3
  }
});

class ContactListItem extends Component {
  _getSubtitleStyle() {
    const { contact, theme } = this.props;

    return [
      styles.subtitle,
      theme.subtitle,
      contact.unread ? [styles.subtitleUnread, theme.subtitleUnread] : null
    ];
  }

  _getDate() {
    const { contact } = this.props;
    let timestamp = contact.createdAt;

    if (contact.lastMessage) {
      timestamp = contact.lastMessage.createdAt;
    }

    if (contact.contactRequest) {
      timestamp = contact.contactRequest.createdAt;
    }

    return new Date(timestamp * 1000);
  }

  _getReceivedText() {
    const { contact } = this.props;
    const defaultText = 'You received';

    if (!contact.isVendor) {
      return defaultText;
    }

    const vendor = vendors.get(contact.vendorId);
    return vendor.receivedText || defaultText;
  }

  _getAddedText() {
    const { contact } = this.props;
    const defaultText = 'Was added as a new contact';

    if (!contact.isVendor) {
      return defaultText;
    }

    const vendor = vendors.get(contact.vendorId);
    return vendor.addedText || defaultText;
  }

  _renderTitle() {
    const { contact } = this.props;

    if (contact.isVendor) {
      return vendors.get(contact.vendorId).displayName;
    }

    return contact.displayName || contact.username || 'Unknown';
  }

  _renderBtcAmount(amountBtc) {
    const subtitleStyle = this._getSubtitleStyle();

    return (
      <CurrencyLabelContainer
        amountBtc={amountBtc}
        currencyType={CURRENCY_TYPE_PRIMARY}
        style={subtitleStyle}
      />
    );
  }

  _renderSubtitle() {
    const { contact, userProfile } = this.props;
    const { lastMessage, contactRequest } = contact;

    if (lastMessage) {
      if (lastMessage.from) {
        return (
          <Text>
            {this._getReceivedText()} {this._renderBtcAmount(lastMessage.amountBtc)}
          </Text>
        );
      }

      return (
        <Text>
          You sent {this._renderBtcAmount(lastMessage.amountBtc)}
        </Text>
      );
    }

    if (contactRequest) {
      if (contactRequest.from === userProfile.address) {
        return 'You sent a contact request';
      }

      return 'Wants to add you as a contact';
    }

    return this._getAddedText();
  }

  render() {
    const { contact, theme } = this.props;
    const avatarChecksum = contact.avatar ? contact.avatar.checksum : null;
    const subtitleStyle = this._getSubtitleStyle();

    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.item, theme.background]}>
        <View style={styles.avatarWrapper}>
          <Avatar
            pineAddress={contact.address}
            vendorId={contact.vendorId}
            checksum={avatarChecksum}
            size={60}
          />
        </View>
        <View style={styles.titleWrapper}>
          <StyledText style={styles.title} numberOfLines={1}>
            {this._renderTitle()}
          </StyledText>
          <View style={styles.subtitleWrapper}>
            <MessageIndicatorContainer message={contact.lastMessage} style={styles.indicator} />
            <StyledText style={subtitleStyle} numberOfLines={1}>
              { this._renderSubtitle() }
            </StyledText>
            <Bullet style={styles.bullet} />
            <RelativeDateLabelShort date={this._getDate()} style={[styles.relativeDate, theme.subtitle]} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

ContactListItem.propTypes = {
  contact: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  theme: PropTypes.object
};

export default withTheme(ContactListItem);
