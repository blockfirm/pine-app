import React, { Component } from 'react';
import { StyleSheet, Image, Share } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import ContentView from './ContentView';
import StyledText from './StyledText';
import Paragraph from './Paragraph';
import Link from './Link';

const styles = StyleSheet.create({
  view: {
    marginTop: 0,
    justifyContent: 'center'
  },
  illustration: {
    width: 235,
    height: 177,
    marginBottom: 20
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
    const image = require('../images/illustrations/IWantMyBitcoin.png');

    return (
      <ContentView style={styles.view} hasToolbar={true}>
        <Image source={image} style={styles.illustration} />

        <StyledText style={[headerStyles.title, styles.title]}>
          Your wallet looks empty
        </StyledText>
        <Paragraph style={styles.paragraph}>
          Have any friends who owe you money?
          Ask them to pay you in bitcoin!
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
