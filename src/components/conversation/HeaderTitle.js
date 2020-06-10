import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../../contexts/theme';
import vendors from '../../vendors';
import headerStyles from '../../styles/headerStyles';
import StyledText from '../StyledText';

const STUB_LENGTH = 8;

/**
 * Node aliases are displayed instead of the node public key on the
 * ConversationScreen for non-Pine lightning payments to custodial
 * lightning services. They are not necessarily the same alias that
 * is defined by the node itself.
 *
 * Node keys should not be updated in order to preserve existing
 * payment history. Instead, append new node keys with their
 * respective aliases.
 */
const ALIAS_BLUE_WALLET = 'BlueWallet';
const ALIAS_WALLET_OF_SATOSHI = 'Wallet of Satoshi';
const ALIAS_TIPPIN_ME = 'tippin.me';

const NODE_ALIASES = {
  '02e89ca9e8da72b33d896bae51d20e7e6675aa971f7557500b6591b15429e717f1': ALIAS_BLUE_WALLET,
  '02004c625d622245606a1ea2c1c69cfb4516b703b47945a3647713c05fe4aaeb1c': ALIAS_WALLET_OF_SATOSHI,
  '03c2abfa93eacec04721c019644584424aab2ba4dff3ac9bdab4e9c97007491dda': ALIAS_TIPPIN_ME
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
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

const getLightningNodeAlias = (lightningNodeKey) => {
  if (NODE_ALIASES[lightningNodeKey]) {
    return NODE_ALIASES[lightningNodeKey];
  }

  return getShortenedAddress(lightningNodeKey);
};

const formatVendorUrl = (url) => {
  if (!url) {
    return '';
  }

  return url.replace(/http(s?):\/\//i, '');
};

class HeaderTitle extends Component {
  render() {
    const { contact, theme } = this.props;
    const { address, isBitcoinAddress, isLightningNode, isVendor } = contact;
    let displayName = contact.displayName || contact.username || 'Unknown';
    let displayAddress = address;

    if (isBitcoinAddress) {
      displayAddress = getShortenedAddress(address);
    } else if (isLightningNode) {
      displayAddress = getLightningNodeAlias(contact.lightningNodeKey);
    } else if (isVendor) {
      const vendor = vendors.get(contact.vendorId);

      displayName = vendor.displayName;
      displayAddress = formatVendorUrl(vendor.url);
    }

    return (
      <View>
        <StyledText style={[headerStyles.title, theme.headerTitle, styles.title]}>
          {displayName}
        </StyledText>
        <StyledText style={[headerStyles.title, theme.headerSubtitle, styles.subtitle]}>
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
    isLightningNode: PropTypes.bool,
    isVendor: PropTypes.bool,
    vendorId: PropTypes.string,
    lightningNodeKey: PropTypes.string
  }),
  theme: PropTypes.object.isRequired
};

export default withTheme(HeaderTitle);
