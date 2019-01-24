import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Share } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getTransactionAmount from '../crypto/bitcoin/getTransactionAmount';
import headerStyles from '../styles/headerStyles';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import TransactionDetailsHeaderTitle from '../components/transaction/TransactionDetailsHeaderTitle';
import Bullet from '../components/typography/Bullet';
import ContentView from '../components/ContentView';
import BackButton from '../components/BackButton';
import AddressLabel from '../components/AddressLabel';
import FeeLabel from '../components/FeeLabel';
import StyledText from '../components/StyledText';
import ShareIcon from '../components/icons/ShareIcon';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  amountContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    margin: 16
  },
  payTitle: {
    color: '#B1AFB7',
    fontSize: 17,
    letterSpacing: 0.07
  },
  amount: {
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: -0.1,
    color: '#262626'
  },
  amountUnit: {
    color: '#B1AFB7',
    fontSize: 17
  },
  details: {
    alignSelf: 'stretch',
    marginTop: 16,
    marginHorizontal: 16
  },
  detail: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ECECEC'
  },
  lastDetail: {
    borderBottomWidth: 0
  },
  label: {
    color: '#8E8E93',
    fontSize: 15
  },
  valueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  value: {
    color: '#000000',
    fontSize: 15,
    position: 'absolute',
    right: 0,
    top: 16
  },
  valueLabel: {
    color: '#000000',
    fontSize: 15
  },
  errorText: {
    color: '#FF3B30'
  },
  share: {
    position: 'absolute',
    top: 0,
    right: 11.5,
    padding: 9 // The padding makes it easier to press.
  }
});

/**
 * Returns a link to the transaction on Blockstream's block explorer.
 * Notes: Eventually it would be nice to link to a block explorer
 * hosted by Pine instead.
 */
const getBlockExplorerLink = (transactionId, bitcoinNetwork) => {
  if (bitcoinNetwork === 'testnet') {
    return `https://blockstream.info/testnet/tx/${transactionId}`;
  }

  return `https://blockstream.info/tx/${transactionId}`;
};

const shareTransaction = (transaction, bitcoinNetwork) => {
  const url = getBlockExplorerLink(transaction.txid, bitcoinNetwork);
  Share.share({ url });
};

@connect((state) => ({
  externalAddresses: state.bitcoin.wallet.addresses.external.items,
  internalAddresses: state.bitcoin.wallet.addresses.internal.items,
  defaultBitcoinUnit: state.settings.bitcoin.unit
}))
export default class TransactionDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { transaction, bitcoinNetwork } = navigation.state.params;

    return {
      headerTitle: <TransactionDetailsHeaderTitle transaction={transaction} />,
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight: (
        <TouchableOpacity onPress={shareTransaction.bind(null, transaction, bitcoinNetwork)} style={styles.share}>
          <ShareIcon />
        </TouchableOpacity>
      )
    };
  };

  constructor() {
    super(...arguments);

    const amount = this._getAmount();
    const fee = this._getFee();
    const isOutgoing = amount < 0;
    const address = this._getAddress(isOutgoing);

    this.state = {
      amount,
      fee,
      address,
      isOutgoing
    };
  }

  _getAddress(isOutgoing) {
    const { externalAddresses, internalAddresses } = this.props;
    const { params } = this.props.navigation.state;
    const { transaction } = params;
    let address;

    transaction.vout.some((vout) => {
      return vout.scriptPubKey.addresses.some((voutAddress) => {
        if (isOutgoing) {
          if (!(voutAddress in externalAddresses) && !(voutAddress in internalAddresses)) {
            address = voutAddress;
            return true;
          }
        } else if (voutAddress in externalAddresses) {
          address = voutAddress;
          return true;
        }
      });
    });

    return address;
  }

  _getAmount() {
    const { externalAddresses, internalAddresses } = this.props;
    const { params } = this.props.navigation.state;
    const { transaction } = params;
    const amount = getTransactionAmount(transaction, externalAddresses, internalAddresses);

    return amount;
  }

  _getFee() {
    const { params } = this.props.navigation.state;
    const { transaction } = params;

    const valueIn = transaction.vin.reduce((sum, vin) => {
      if (!vin.prevOut) {
        return sum;
      }

      return sum + vin.prevOut.value;
    }, 0);

    const valueOut = transaction.vout.reduce((sum, vout) => {
      return sum + vout.value;
    }, 0);

    const fee = valueIn - valueOut;

    return fee;
  }

  _renderTotal() {
    const { fee, isOutgoing } = this.state;
    const amount = Math.abs(this.state.amount);
    const totalAmount = isOutgoing ? (amount + fee) : amount;
    const title = isOutgoing ? 'Total Sent' : 'Received';

    return (
      <View style={[styles.detail, styles.lastDetail]}>
        <StyledText style={styles.label}>
          {title}
        </StyledText>
        <View style={styles.value}>
          <View style={styles.valueWrapper}>
            <CurrencyLabelContainer amountBtc={totalAmount} currencyType='primary' style={styles.valueLabel} />
            <Bullet />
            <CurrencyLabelContainer amountBtc={totalAmount} currencyType='secondary' style={styles.valueLabel} />
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { defaultBitcoinUnit } = this.props;
    const { params } = this.props.navigation.state;
    const { transaction } = params;
    const { address, amount, fee, isOutgoing } = this.state;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <ScrollView style={styles.details}>
            <View style={styles.detail}>
              <StyledText style={styles.label}>To</StyledText>
              <AddressLabel address={address} style={styles.value} textStyle={styles.valueLabel} />
            </View>
            <View style={styles.detail}>
              <StyledText style={styles.label}>Fee { !isOutgoing ? '(Paid by Sender)' : '' }</StyledText>
              <View style={styles.value}>
                <FeeLabel fee={fee} amount={amount} unit={defaultBitcoinUnit} style={styles.valueLabel} />
              </View>
            </View>
            {this._renderTotal()}
          </ScrollView>
        </ContentView>
      </BaseScreen>
    );
  }
}

TransactionDetailsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  externalAddresses: PropTypes.object,
  internalAddresses: PropTypes.object,
  defaultBitcoinUnit: PropTypes.string
};
