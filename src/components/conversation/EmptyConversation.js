import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Paragraph from '../Paragraph';

const illustration = require('../../images/illustrations/BitcoinWithWings.png');

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  illustration: {
    width: 125,
    height: 140,
    marginBottom: 20
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 15,
    maxWidth: 300
  }
});

export default class EmptyConversation extends Component {
  render() {
    const { contact } = this.props;
    const displayName = contact.displayName || contact.username || contact.address;

    if (contact.isVendor) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        <Image source={illustration} style={styles.illustration} />
        <Paragraph style={styles.paragraph}>
          Send your first payment to {displayName}
        </Paragraph>
      </View>
    );
  }
}

EmptyConversation.propTypes = {
  contact: PropTypes.object.isRequired
};
