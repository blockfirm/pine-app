import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../../styles/headerStyles';
import StyledText from '../StyledText';

const STUB_LENGTH = 8;

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

const getShortenedAddress = (address) => {
  if (!address) {
    return '';
  }

  const start = address.slice(0, STUB_LENGTH);
  const end = address.slice(-STUB_LENGTH);

  return `${start}...${end}`;
};

export default class HeaderTitle extends Component {
  render() {
    const { contact } = this.props;
    const { address, isBitcoinAddress } = contact;
    const displayName = contact.displayName || contact.username || 'Unknown';
    const displayAddress = isBitcoinAddress ? getShortenedAddress(address) : address;

    return (
      <View>
        <StyledText style={[headerStyles.title, styles.title]}>
          {displayName}
        </StyledText>
        <StyledText style={[headerStyles.title, styles.subtitle]}>
          {displayAddress}
        </StyledText>
      </View>
    );
  }
}

HeaderTitle.propTypes = {
  contact: PropTypes.shape({
    displayName: PropTypes.string,
    username: PropTypes.string,
    address: PropTypes.string,
    isBitcoinAddress: PropTypes.bool
  })
};
