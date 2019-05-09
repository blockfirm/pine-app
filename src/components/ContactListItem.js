import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import {
  default as CurrencyLabelContainer,
  CURRENCY_TYPE_PRIMARY
} from '../containers/CurrencyLabelContainer';

import Bullet from './typography/Bullet';
import SentIndicator from './indicators/SentIndicator';
import ReceivedIndicator from './indicators/ReceivedIndicator';
import ErrorIndicator from './indicators/ErrorIndicator';
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
    paddingVertical: 8,
    backgroundColor: 'white'
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
    color: '#B1AFB7',
    fontSize: 14,
    fontWeight: '400'
  },
  subtitleUnread: {
    fontWeight: '600',
    color: 'black'
  },
  bullet: {
    marginHorizontal: 5,
    height: 2,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#B1AFB7'
  },
  relativeDate: {
    color: '#B1AFB7',
    fontSize: 14,
    fontWeight: '400'
  },
  indicator: {
    marginRight: 3
  }
});

export default class ContactListItem extends Component {
  _getSubtitleStyle() {
    const { contact } = this.props;

    return [
      styles.subtitle,
      contact.unread ? styles.subtitleUnread : null
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

  _renderTitle() {
    const { contact } = this.props;
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

  _renderIndicator() {
    const { lastMessage } = this.props.contact;

    if (!lastMessage) {
      return null;
    }

    if (lastMessage.error) {
      return <ErrorIndicator style={styles.indicator} />;
    }

    if (lastMessage.from) {
      return <ReceivedIndicator style={styles.indicator} />;
    }

    return <SentIndicator style={styles.indicator} />;
  }

  _renderSubtitle() {
    const { contact, userProfile } = this.props;
    const { lastMessage, contactRequest } = contact;

    if (lastMessage) {
      if (lastMessage.from) {
        return (
          <Text>
            You received {this._renderBtcAmount(lastMessage.amountBtc)}
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

    return 'Was added as a new contact';
  }

  render() {
    const { contact } = this.props;
    const avatarChecksum = contact.avatar ? contact.avatar.checksum : null;
    const subtitleStyle = this._getSubtitleStyle();

    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.item}>
        <View style={styles.avatarWrapper}>
          <Avatar
            pineAddress={contact.address}
            checksum={avatarChecksum}
            size={60}
          />
        </View>
        <View style={styles.titleWrapper}>
          <StyledText style={styles.title} numberOfLines={1}>
            {this._renderTitle()}
          </StyledText>
          <View style={styles.subtitleWrapper}>
            { this._renderIndicator() }
            <StyledText style={subtitleStyle} numberOfLines={1}>
              { this._renderSubtitle() }
            </StyledText>
            <Bullet style={styles.bullet} />
            <RelativeDateLabelShort date={this._getDate()} style={styles.relativeDate} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

ContactListItem.propTypes = {
  contact: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  onPress: PropTypes.func
};
