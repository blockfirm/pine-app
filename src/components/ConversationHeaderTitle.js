import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    color: '#B1AFB7',
    fontSize: 13,
    fontWeight: '500'
  }
});

export default class ConversationHeaderTitle extends Component {
  render() {
    const { contact } = this.props;
    const displayName = contact.displayName || contact.username;

    return (
      <View>
        <StyledText style={[headerStyles.title, styles.title]}>
          {displayName}
        </StyledText>
        <StyledText style={[headerStyles.title, styles.subtitle]}>
          {contact.address}
        </StyledText>
      </View>
    );
  }
}

ConversationHeaderTitle.propTypes = {
  contact: PropTypes.object.isRequired
};
