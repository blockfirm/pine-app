import React, { Component } from 'react';
import { StyleSheet, Image, Share } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import ContentView from './ContentView';
import StyledText from './StyledText';
import Paragraph from './Paragraph';
import Link from './Link';

const illustration = require('../images/illustrations/AskForBitcoin.png');

const styles = StyleSheet.create({
  view: {
    marginTop: 0,
    justifyContent: 'center'
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
      <ContentView style={styles.view} hasToolbar={true}>
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
      </ContentView>
    );
  }
}

TransactionListEmpty.propTypes = {
  address: PropTypes.string
};
