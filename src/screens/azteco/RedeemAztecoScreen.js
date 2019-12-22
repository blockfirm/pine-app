import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sync as syncWallet } from '../../actions/bitcoin/wallet';
import { addVendor, addVendorAssociatedAddress } from '../../actions/contacts';
import { handle as handleError } from '../../actions/error';
import { setHomeScreenIndex } from '../../actions/navigate';
import vendors from '../../vendors';
import * as azteco from '../../vendors/azteco';
import Paragraph from '../../components/Paragraph';
import BaseScreen from '../BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    height: 42
  }
});

@connect((state) => ({
  address: state.bitcoin.wallet.addresses.external.unused,
  contacts: state.contacts.items
}))
export default class RedeemAztecoScreen extends Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this._redeem();
  }

  _hasAztecoContact() {
    const { contacts } = this.props;

    return Object.values(contacts).some(contact => {
      return contact.vendorId === vendors.VENDOR_AZTECO;
    });
  }

  _redeem() {
    const { address, dispatch, navigation, screenProps } = this.props;
    const voucher = navigation.getParam('voucher');

    if (!voucher) {
      return;
    }

    return azteco.redeem(voucher, address)
      .then(() => {
        if (this._hasAztecoContact()) {
          return dispatch(
            addVendorAssociatedAddress(vendors.VENDOR_AZTECO, address)
          );
        }

        return dispatch(addVendor(vendors.VENDOR_AZTECO, {
          associatedAddresses: [address]
        }));
      })
      .then(() => {
        /**
         * Wait a little before syncing so that the redemption
         * transaction has time to propagate the network.
         */
        return new Promise(resolve => setTimeout(resolve, 2000));
      })
      .catch(() => {
        const error = new Error(
          'The voucher could not be redeemed. Please try again or contact Azteco at support@azte.co.'
        );

        dispatch(handleError(error));
      })
      .then(() => {
        return dispatch(syncWallet());
      })
      .then(() => {
        dispatch(setHomeScreenIndex(1));
        screenProps.dismiss();
      });
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <ActivityIndicator color='gray' style={styles.loader} size='small' />
        <Paragraph>Redeeming Azteco Voucher...</Paragraph>
      </BaseScreen>
    );
  }
}

RedeemAztecoScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  screenProps: PropTypes.object,
  address: PropTypes.string,
  contacts: PropTypes.object
};
