/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Share, LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import headerStyles from '../styles/headerStyles';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import Bullet from '../components/typography/Bullet';
import ContentView from '../components/ContentView';
import BackButton from '../components/BackButton';
import AddressLabel from '../components/AddressLabel';
import DateLabel from '../components/DateLabel';
import FeeLabel from '../components/FeeLabel';
import StyledText from '../components/StyledText';
import ErrorMessage from '../components/ErrorMessage';
import ShareIcon from '../components/icons/ShareIcon';
import BaseScreen from './BaseScreen';

const CURRENCY_BTC = 'BTC';

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
    paddingTop: 16,
    marginHorizontal: 20
  },
  detail: {
    paddingVertical: 15,
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
  },
  arrow: {
    color: '#9B9B9B',
    fontSize: 19,
    marginLeft: 7,
    marginTop: 2
  },
  statusText: {
    fontSize: 15,
    color: 'black',
    marginTop: 5
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

  state = {
    showStatusText: false
  }

  constructor() {
    super(...arguments);
    this._toggleStatusText = this._toggleStatusText.bind(this);
  }

  _toggleStatusText() {
    const animation = LayoutAnimation.create(
      200,
      LayoutAnimation.Types['easeOut'],
      LayoutAnimation.Properties.opacity
    );

    LayoutAnimation.configureNext(animation);

    this.setState({
      showStatusText: !this.state.showStatusText
    });
  }

  _getStatus() {
    const { transaction } = this.props.navigation.state.params;

    if (!transaction) {
      return 'Not Broadcasted';
    }

    if (!transaction.confirmations > 0) {
      return 'Pending Confirmation';
    }

    return 'Confirmed';
  }

  _getStatusText() {
    const { transaction, message } = this.props.navigation.state.params;

    if (!transaction) {
      if (message.from) {
        if (message.error) {
          return 'The transaction has not been broadcasted to the network due to an error. This is not a valid payment.';
        } else {
          return 'The transaction has not been broadcasted to the network yet but should be in a moment. This should not be seen as a valid payment until it has.';
        }
      } else {
        return 'The transaction has not been broadcasted by its recipient yet. This could be due to their device being turned off or that they are no longer using the Pine app. Give it some time and if it has not been broadcasted within 2 days it will expire.';
      }
    }

    if (!transaction.confirmations > 0) {
      if (message.from) {
        return 'The transaction has been broadcasted and is waiting to be confirmed. It should be spendable within 30 minutes.';
      } else {
        return 'The transaction has been broadcasted and any potential change has been unlocked for you to spend. The payment will be spendable by its recipient once the transaction has been confirmed, which should be within 30 minutes.';
      }
    }

    if (message.from) {
      return 'The transaction has been confirmed in a block and can now be spent.';
    }

    return 'The transaction has been confirmed in a block and can now be spent by its recipient.';
  }

  _renderStatus() {
    const { showStatusText } = this.state;

    return (
      <View style={styles.detail}>
        <StyledText style={styles.label}>Payment Status</StyledText>

        { !showStatusText ? (
          <View style={styles.value}>
            <TouchableOpacity onPress={this._toggleStatusText} style={styles.valueWrapper}>
              <StyledText style={styles.valueLabel}>
                { this._getStatus() }
              </StyledText>
              <Icon name='ios-arrow-down' style={styles.arrow} />
            </TouchableOpacity>
          </View>
        ) : null }

        { showStatusText ? (
          <StyledText style={styles.statusText}>
            { this._getStatusText() }
          </StyledText>
        ) : null }
      </View>
    );
  }

  _renderError() {
    const { message } = this.props.navigation.state.params;

    if (!message.error) {
      return;
    }

    return (
      <ErrorMessage
        title='Invalid Payment'
        message={message.error}
        details={JSON.stringify(message, null, 2)}
      />
    );
  }

  _renderAmount() {
    const { message } = this.props.navigation.state.params;
    const title = message.from ? 'Amount Received' : 'Amount Sent';

    const style = [
      styles.detail,
      message.from && styles.lastDetail
    ];

    return (
      <View style={style}>
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
            currency={CURRENCY_BTC}
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

    const style = [
      styles.detail,
      !message.from && styles.lastDetail
    ];

    return (
      <View style={style}>
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
            { this._renderError() }
            { this._renderStatus() }
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
