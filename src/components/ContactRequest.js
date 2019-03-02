import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Avatar from './Avatar';
import Paragraph from './Paragraph';
import SmallButton from './buttons/SmallButton';
import Link from './Link';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: 'black',
    fontSize: 20
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 20,
    maxWidth: 300
  },
  ignore: {
    paddingTop: 0,
    marginTop: 20
  },
  deleteLabel: {
    color: '#FF3B30'
  }
});

export default class ContactRequest extends Component {
  _renderAvatar() {
    const { contact } = this.props;
    const avatarChecksum = contact.avatar ? contact.avatar.checksum : null;

    return (
      <Avatar
        pineAddress={contact.pineAddress}
        checksum={avatarChecksum}
        size={60}
      />
    );
  }

  _renderIncoming() {
    const { contact } = this.props;

    return (
      <View style={styles.wrapper}>
        {this._renderAvatar()}

        <Paragraph style={styles.paragraph}>
          {contact.pineAddress} wants to add you as a contact.
        </Paragraph>

        <SmallButton label='Accept' onPress={this.props.onAccept} showLoader={true} />

        <Link onPress={this.props.onIgnore} style={styles.ignore}>
          Ignore
        </Link>
      </View>
    );
  }

  _renderOutgoing() {
    const { contact } = this.props;

    return (
      <View style={styles.wrapper}>
        {this._renderAvatar()}

        <Paragraph style={styles.paragraph}>
          Waiting for {contact.pineAddress} to respond to
          your contact request.
        </Paragraph>

        <Link onPress={this.props.onDelete} style={{ paddingTop: 0 }} labelStyle={styles.deleteLabel}>
          Delete
        </Link>
      </View>
    );
  }

  render() {
    const { contact, userProfile } = this.props;

    if (!contact.contactRequest) {
      return null;
    }

    if (contact.contactRequest.from === userProfile.pineAddress) {
      return this._renderOutgoing();
    }

    return this._renderIncoming();
  }
}

ContactRequest.propTypes = {
  contact: PropTypes.object.isRequired,
  userProfile: PropTypes.object,
  onAccept: PropTypes.func,
  onIgnore: PropTypes.func,
  onDelete: PropTypes.func
};
