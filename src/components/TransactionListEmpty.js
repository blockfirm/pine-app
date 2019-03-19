import React, { Component } from 'react';
import { StyleSheet, Image, Share, View } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import StyledText from './StyledText';
import Paragraph from './Paragraph';
import Link from './Link';

const illustration = require('../images/illustrations/AskForBitcoin.png');

const styles = StyleSheet.create({
  view: {
    marginTop: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50
  },
  illustration: {
    width: 133,
    height: 132,
    marginBottom: 50
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
  },
  link: {
    fontWeight: '400'
  }
});

export default class TransactionListEmpty extends Component {
  _shareAddress() {
    const address = this.props.address;
    Share.share({ message: address });
  }

  render() {
    return (
      <View style={styles.view}>
        <Image source={illustration} style={styles.illustration} />

        <StyledText style={[headerStyles.title, styles.title]}>
          Your Account Looks Empty
        </StyledText>
        <Paragraph style={styles.paragraph}>
          Have any friends who owe you money?
          Ask them to pay you with bitcoin!
        </Paragraph>
        <Link onPress={this._shareAddress.bind(this)} labelStyle={styles.link}>
          Share Your Address
        </Link>
      </View>
    );
  }
}

TransactionListEmpty.propTypes = {
  address: PropTypes.string
};
