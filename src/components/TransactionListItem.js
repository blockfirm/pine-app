import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

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
  }
});

export default class TransactionListItem extends Component {
  _getTitle() {
    const { contact } = this.props;
    return contact.displayName || contact.username || 'Unknown User';
  }

  _getSubtitle() {
    const { contact, userProfile } = this.props;

    if (contact.contactRequest) {
      if (contact.contactRequest.from === userProfile.address) {
        return 'You sent a contact request';
      }

      return 'Wants to add you as a contact';
    }

    return 'Was added as a new contact';
  }

  _getDate() {
    const { contact } = this.props;
    let timestamp = contact.createdAt;

    if (contact.contactRequest) {
      timestamp = contact.contactRequest.createdAt;
    }

    return new Date(timestamp * 1000);
  }

  render() {
    const { contact } = this.props;
    const avatarChecksum = contact.avatar ? contact.avatar.checksum : null;

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
            {this._getTitle()}
          </StyledText>
          <View style={styles.subtitleWrapper}>
            <StyledText style={styles.subtitle} numberOfLines={1}>
              {this._getSubtitle()}
            </StyledText>
            <Bullet style={styles.bullet} />
            <RelativeDateLabelShort date={this._getDate()} style={styles.relativeDate} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

TransactionListItem.propTypes = {
  contact: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  onPress: PropTypes.func
};
