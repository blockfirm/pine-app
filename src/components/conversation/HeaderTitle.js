import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import vendors from '../../vendors';
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
    return 'Unknown Sender';
  }

  const start = address.slice(0, STUB_LENGTH);
  const end = address.slice(-STUB_LENGTH);

  return `${start}...${end}`;
};

const formatVendorUrl = (url) => {
  if (!url) {
    return '';
  }

  return url.replace(/http(s?):\/\//i, '');
};

export default class HeaderTitle extends Component {
  render() {
    const { contact } = this.props;
    const { address, isBitcoinAddress, isVendor } = contact;
    let displayName = contact.displayName || contact.username || 'Unknown';
    let displayAddress = address;

    if (isBitcoinAddress) {
      displayAddress = getShortenedAddress(address);
    } else if (isVendor) {
      const vendor = vendors.get(contact.vendorId);

      displayName = vendor.displayName;
      displayAddress = formatVendorUrl(vendor.url);
    }

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
    isBitcoinAddress: PropTypes.bool,
    isVendor: PropTypes.bool,
    vendorId: PropTypes.string
  })
};
