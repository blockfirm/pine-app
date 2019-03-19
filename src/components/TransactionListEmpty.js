import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import StyledText from './StyledText';
import Paragraph from './Paragraph';
import Link from './Link';

const illustration = require('../images/illustrations/EmptyListAvatar.png');

const styles = StyleSheet.create({
  view: {
    marginTop: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50
  },
  illustration: {
    width: 108,
    height: 108,
    marginBottom: 40
  },
  title: {
    color: '#949494'
  },
  paragraph: {
    textAlign: 'center',
    lineHeight: 22,
    paddingTop: 17,
    paddingLeft: 15,
    paddingRight: 15
  }
});

export default class TransactionListEmpty extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Image source={illustration} style={styles.illustration} />

        <StyledText style={[headerStyles.title, styles.title]}>
          It&#39;s lonely here
        </StyledText>
        <Paragraph style={styles.paragraph}>
          Add a contact to start sending and receiving bitcoin.
        </Paragraph>

        <Link onPress={this.props.onAddContactPress}>
          Add Contact
        </Link>
      </View>
    );
  }
}

TransactionListEmpty.propTypes = {
  address: PropTypes.string,
  onAddContactPress: PropTypes.func
};
