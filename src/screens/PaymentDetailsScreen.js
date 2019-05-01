import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Share } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../styles/headerStyles';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import Bullet from '../components/typography/Bullet';
import ContentView from '../components/ContentView';
import BackButton from '../components/BackButton';
import AddressLabel from '../components/AddressLabel';
import DateLabel from '../components/DateLabel';
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

const shareTransaction = (txid, bitcoinNetwork) => {
  const url = getBlockExplorerLink(txid, bitcoinNetwork);
  Share.share({ url });
};

@connect((state) => ({
  defaultBitcoinUnit: state.settings.bitcoin.unit
}))
export default class PaymentDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { message, bitcoinNetwork } = navigation.state.params;

    return {
      title: 'Payment Details',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight: (
        <TouchableOpacity onPress={shareTransaction.bind(null, message.txid, bitcoinNetwork)} style={styles.share}>
          <ShareIcon />
        </TouchableOpacity>
      )
    };
  };

  _getStatus() {
    const { transaction } = this.props.navigation.state.params;

    if (!transaction) {
      return 'Not Broadcasted'
    }

    if (!transaction.confirmations > 0) {
      return 'Pending Confirmation';
    }

    return 'Confirmed';
  }

  _renderAmount() {
    const { message } = this.props.navigation.state.params;
    const title = message.from ? 'Amount Received' : 'Amount Sent';

    return (
      <View style={[styles.detail, styles.lastDetail]}>
        <StyledText style={styles.label}>
          {title}
        </StyledText>
        <View style={styles.value}>
          <View style={styles.valueWrapper}>
            <CurrencyLabelContainer amountBtc={message.amountBtc} currencyType='primary' style={styles.valueLabel} />
            <Bullet />
            <CurrencyLabelContainer amountBtc={message.amountBtc} currencyType='secondary' style={styles.valueLabel} />
          </View>
        </View>
      </View>
    );
  }

  _renderFee() {
    const { navigation, defaultBitcoinUnit } = this.props;
    const { message } = navigation.state.params;

    if (typeof message.feeBtc !== 'number') {
      return null;
    }

    return (
      <View style={styles.detail}>
        <StyledText style={styles.label}>Fee</StyledText>
        <View style={styles.value}>
          <FeeLabel
            fee={message.feeBtc}
            amount={message.amountBtc}
            unit={defaultBitcoinUnit}
            style={styles.valueLabel}
          />
        </View>
      </View>
    );
  }

  _renderTotal() {
    const { navigation } = this.props;
    const { message } = navigation.state.params;
    const { amountBtc, feeBtc } = message;

    if (typeof feeBtc !== 'number') {
      return null;
    }

    const totalBtc = amountBtc + feeBtc;

    return (
      <View style={[styles.detail, styles.lastDetail]}>
        <StyledText style={styles.label}>
          Total Paid
        </StyledText>
        <View style={styles.value}>
          <View style={styles.valueWrapper}>
            <CurrencyLabelContainer amountBtc={totalBtc} currencyType='primary' style={styles.valueLabel} />
            <Bullet />
            <CurrencyLabelContainer amountBtc={totalBtc} currencyType='secondary' style={styles.valueLabel} />
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { message } = this.props.navigation.state.params;
    const address = message.address && message.address.address;
    const createdDate = new Date(message.createdAt * 1000);

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <ScrollView style={styles.details}>
            <View style={styles.detail}>
              <StyledText style={styles.label}>Payment Status</StyledText>
              <View style={styles.value}>
                <StyledText style={styles.valueLabel}>
                  { this._getStatus() }
                </StyledText>
              </View>
            </View>
            <View style={styles.detail}>
              <StyledText style={styles.label}>Transaction ID</StyledText>
              <AddressLabel address={message.txid} style={styles.value} textStyle={styles.valueLabel} />
            </View>
            <View style={styles.detail}>
              <StyledText style={styles.label}>To</StyledText>
              <AddressLabel address={address} style={styles.value} textStyle={styles.valueLabel} />
            </View>
            <View style={styles.detail}>
              <StyledText style={styles.label}>Sent</StyledText>
              <View style={styles.value}>
                <DateLabel date={createdDate} style={styles.valueLabel} />
              </View>
            </View>
            { this._renderAmount() }
            { this._renderFee() }
            { this._renderTotal() }
          </ScrollView>
        </ContentView>
      </BaseScreen>
    );
  }
}

PaymentDetailsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  defaultBitcoinUnit: PropTypes.string
};
