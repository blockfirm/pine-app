import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../../contexts/theme';
import Paragraph from '../Paragraph';

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

class EmptyConversation extends Component {
  render() {
    const { contact, theme } = this.props;
    const displayName = contact.displayName || contact.username || contact.address;

    if (contact.isVendor) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        <Image source={theme.illustrationBitcoinWithWings} style={styles.illustration} />
        <Paragraph style={styles.paragraph}>
          Send your first payment to {displayName}
        </Paragraph>
      </View>
    );
  }
}

EmptyConversation.propTypes = {
  contact: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(EmptyConversation);
