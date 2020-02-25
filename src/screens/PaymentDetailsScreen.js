/* eslint-disable max-lines */
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  LayoutAnimation,
  ActionSheetIOS,
  ActivityIndicator,
  Alert
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeHaptic from 'react-native-haptic';

import { satsToBtc } from '../crypto/bitcoin/convert';
import { withTheme } from '../contexts/theme';
import { cancelPayment } from '../actions/messages';
import { handle as handleError } from '../actions/error';
import headerStyles from '../styles/headerStyles';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import HeaderTitle from '../components/HeaderTitle';
import HeaderBackground from '../components/HeaderBackground';
import Bullet from '../components/typography/Bullet';
import ContentView from '../components/ContentView';
import BackButton from '../components/BackButton';
import AddressLabel from '../components/AddressLabel';
import DateLabel from '../components/DateLabel';
import FeeLabel from '../components/FeeLabel';
import StyledText from '../components/StyledText';
import ErrorMessage from '../components/ErrorMessage';
import Link from '../components/Link';
import Footer from '../components/Footer';
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
    marginHorizontal: 20
  },
  detail: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  lastDetail: {
    borderBottomWidth: 0
  },
  label: {
    fontSize: 15
  },
  valueWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  value: {
    fontSize: 15,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  valueLabel: {
    fontSize: 15
  },
  share: {
    position: 'absolute',
    top: 0,
    right: 11.5,
    padding: 9 // The padding makes it easier to press.
  },
  arrow: {
    fontSize: 19,
    marginLeft: 7,
    marginTop: 2
  },
  statusText: {
    fontSize: 15,
    marginTop: 5
  },
  footer: {
    left: 0,
    right: 0
  },
  cancel: {
    fontWeight: '400'
  },
  errorWrapper: {
    paddingTop: 16
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

@connect((state) => {
  const { activeConversation } = state.navigate;
  const contact = activeConversation && activeConversation.contact;

  return {
    defaultBitcoinUnit: state.settings.bitcoin.unit,
    contact
  };
})
class PaymentDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { message, bitcoinNetwork } = navigation.state.params;
    let headerRight;

    if (message.txid) {
      headerRight = (
        <TouchableOpacity onPress={shareTransaction.bind(null, message.txid, bitcoinNetwork)} style={styles.share}>
          <ShareIcon />
        </TouchableOpacity>
      )
    }

    return {
      headerTransparent: true,
      headerTitle: <HeaderTitle title='Payment Details' />,
      headerBackground: <HeaderBackground />,
      headerStyle: headerStyles.borderlessHeader,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight
    };
  };

  state = {
    showStatusText: false,
    cancelling: false
  }

  constructor() {
    super(...arguments);

    this._showCancelConfirmation = this._showCancelConfirmation.bind(this);
    this._toggleStatusText = this._toggleStatusText.bind(this);
  }

  _cancelPayment() {
    const { dispatch, navigation, contact } = this.props;
    const { message } = navigation.state.params;

    this.setState({ cancelling: true });

    return dispatch(cancelPayment(message, contact))
      .then(() => {
        // Just to update the UI.
        navigation.setParams({
          message: {
            ...message,
            canceled: true
          }
        });

        ReactNativeHaptic.generate('notificationSuccess');
      })
      .catch((error) => {
        if (/(rejected)|UTXO/i.test(error.message)) {
          ReactNativeHaptic.generate('notificationError');

          return Alert.alert(
            'Cancellation Failed',
            'The payment could not be canceled because it has already been broadcasted by its recipient.',
            [{ text: 'OK', style: 'cancel' }],
            { cancelable: false }
          );
        }

        dispatch(handleError(error));
      })
      .then(() => {
        this.setState({ cancelling: false });
      });
  }

  _showCancelConfirmation() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'This will cancel the payment. The transaction fee will not be refunded as it will be used to invalidate the transaction.',
      options: ['Don\'t Cancel', 'Cancel Payment'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        this._cancelPayment();
      }
    });
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

  _renderTransactionType() {
    const { theme } = this.props;
    const { invoice } = this.props.navigation.state.params;

    return (
      <View style={[styles.detail, theme.tableBorder]}>
        <StyledText style={[styles.label, theme.tableLabel]}>Payment Type</StyledText>
        <View style={styles.value}>
          <StyledText style={[styles.valueLabel, theme.text]}>
            { invoice ? 'Off-chain (Lightning)' : 'On-chain' }
          </StyledText>
        </View>
      </View>
    );
  }

  _getInvoiceStatus() {
    const { invoice } = this.props.navigation.state.params;

    if (invoice.payee) {
      if (invoice.redeemed) {
        return 'Sent';
      }

      return 'To be Redeemed';
    }

    if (invoice.redeemed) {
      return 'Received';
    }

    return 'To be Redeemed';
  }

  _getTransactionStatus() {
    const { transaction, message } = this.props.navigation.state.params;

    if (!transaction) {
      if (message.canceled) {
        return 'Canceled';
      }

      return 'Not Broadcasted';
    }

    if (!transaction.confirmations > 0) {
      return 'Pending Confirmation';
    }

    return 'Confirmed';
  }

  _getStatus() {
    const { invoice } = this.props.navigation.state.params;

    if (invoice) {
      return this._getInvoiceStatus();
    }

    return this._getTransactionStatus();
  }

  _getInvoiceStatusText() {
    const { invoice } = this.props.navigation.state.params;

    if (invoice.payee) {
      if (invoice.redeemed) {
        return 'The payment has been received by its recipient.';
      }

      return 'The payment has been sent to its recipient\'s gateway node and is waiting to be redeemed.';
    }

    if (invoice.redeemed) {
      return 'The payment has been received.';
    }

    return 'The payment is waiting to be redeemed from your gateway node. You need sufficient inbound capacity in order to redeem this payment.';
  }

  // eslint-disable-next-line max-statements
  _getTransactionStatusText() {
    const { transaction, message } = this.props.navigation.state.params;

    if (!transaction) {
      if (message.from) {
        if (message.canceled) {
          return 'The payment was canceled by the sender. This is not a valid payment.';
        }

        if (message.error) {
          return 'The transaction has not been broadcasted to the network due to an error. This is not a valid payment.';
        } else {
          return 'The transaction has not been broadcasted to the network yet but should be in a moment. This should not be seen as a valid payment until it has.';
        }
      } else {
        if (message.canceled) {
          return 'The payment was canceled by you before it was received by its recipient. The transaction fee was not refunded as it was used to invalidate the transaction.';
        }

        return 'The transaction has not been broadcasted by its recipient yet. Give it some time and cancel this payment if you need to use the funds it has reserved.';
      }
    }

    if (!transaction.confirmations > 0) {
      if (message.from) {
        return 'The transaction has been broadcasted and is waiting to be confirmed. It should be spendable within 10-60 minutes after it was broadcasted.';
      } else {
        return 'The transaction has been broadcasted and any potential change has been unlocked for you to spend. The payment will be spendable by its recipient once the transaction has been confirmed, which should be within 10-60 minutes after it was broadcasted.';
      }
    }

    if (message.from) {
      return 'The transaction has been confirmed in a block and can now be spent.';
    }

    return 'The transaction has been confirmed in a block and can now be spent by its recipient.';
  }

  _getStatusText() {
    const { invoice } = this.props.navigation.state.params;

    if (invoice) {
      return this._getInvoiceStatusText();
    }

    return this._getTransactionStatusText();
  }

  _renderStatus() {
    const { theme } = this.props;
    const { showStatusText } = this.state;

    return (
      <View style={[styles.detail, theme.tableBorder]}>
        <StyledText style={[styles.label, theme.tableLabel]}>Payment Status</StyledText>

        { !showStatusText ? (
          <View style={styles.value}>
            <TouchableOpacity onPress={this._toggleStatusText} style={styles.valueWrapper}>
              <StyledText style={[styles.valueLabel, theme.text]}>
                { this._getStatus() }
              </StyledText>
              <Icon name='ios-arrow-down' style={[styles.arrow, theme.tableArrow]} />
            </TouchableOpacity>
          </View>
        ) : null }

        { showStatusText ? (
          <StyledText style={[styles.statusText, theme.text]}>
            { this._getStatusText() }
          </StyledText>
        ) : null }
      </View>
    );
  }

  _renderError() {
    const { message, invoice } = this.props.navigation.state.params;
    const messageError = message && message.error;
    const redeemError = invoice && invoice.redeemError;
    const error = messageError || redeemError;

    if (!error) {
      return;
    }

    return (
      <View style={styles.errorWrapper}>
        <ErrorMessage
          title={messageError ? 'Invalid Payment' : 'Redeem Error'}
          message={error}
          details={JSON.stringify({ message, invoice }, null, 2)}
        />
      </View>
    );
  }

  _renderAmount() {
    const { theme } = this.props;
    const { message, transaction, invoice } = this.props.navigation.state.params;
    const title = message.from ? 'Amount Received' : 'Amount Sent';
    const amountBtc = invoice ? satsToBtc(invoice.paidAmount) : message.amountBtc;

    const style = [
      styles.detail,
      theme.tableBorder,
      (message.from || invoice) ? styles.lastDetail : null
    ];

    if (message.canceled && !transaction) {
      return null;
    }

    return (
      <View style={style}>
        <StyledText style={[styles.label, theme.tableLabel]}>
          {title}
        </StyledText>
        <View style={styles.value}>
          <View style={styles.valueWrapper}>
            <CurrencyLabelContainer
              amountBtc={amountBtc}
              currencyType='primary'
              style={[styles.valueLabel, theme.text]}
            />
            <Bullet />
            <CurrencyLabelContainer
              amountBtc={amountBtc}
              currencyType='secondary'
              style={[styles.valueLabel, theme.text]}
            />
          </View>
        </View>
      </View>
    );
  }

  _renderFee() {
    const { navigation, defaultBitcoinUnit, theme } = this.props;
    const { message } = navigation.state.params;

    if (typeof message.feeBtc !== 'number') {
      return null;
    }

    return (
      <View style={[styles.detail, theme.tableBorder]}>
        <StyledText style={[styles.label, theme.tableLabel]}>Fee</StyledText>
        <View style={styles.value}>
          <FeeLabel
            fee={message.feeBtc}
            amount={message.amountBtc}
            currency={CURRENCY_BTC}
            unit={defaultBitcoinUnit}
            style={[styles.valueLabel, theme.text]}
          />
        </View>
      </View>
    );
  }

  _renderTotal() {
    const { navigation, theme } = this.props;
    const { message, transaction } = navigation.state.params;
    const { amountBtc, feeBtc } = message;

    if (typeof feeBtc !== 'number') {
      return null;
    }

    if (message.canceled && !transaction) {
      return null;
    }

    const totalBtc = amountBtc + feeBtc;

    const style = [
      styles.detail,
      theme.tableBorder,
      !message.from && styles.lastDetail
    ];

    return (
      <View style={style}>
        <StyledText style={[styles.label, theme.tableLabel]}>
          Total Paid
        </StyledText>
        <View style={styles.value}>
          <View style={styles.valueWrapper}>
            <CurrencyLabelContainer
              amountBtc={totalBtc}
              currencyType='primary'
              style={[styles.valueLabel, theme.text]}
            />
            <Bullet />
            <CurrencyLabelContainer
              amountBtc={totalBtc}
              currencyType='secondary'
              style={[styles.valueLabel, theme.text]}
            />
          </View>
        </View>
      </View>
    );
  }

  _renderCancelButton() {
    const { theme } = this.props;
    const { message, transaction, invoice } = this.props.navigation.state.params;
    const { cancelling } = this.state;

    if (transaction || invoice || message.from || message.canceled) {
      return null;
    }

    if (cancelling) {
      return (
        <Footer style={styles.footer}>
          <ActivityIndicator color='gray' size='small' />
        </Footer>
      );
    }

    return (
      <Footer style={styles.footer}>
        <Link onPress={this._showCancelConfirmation} labelStyle={[styles.cancel, theme.destructiveLabel]}>
          Cancel Payment
        </Link>
      </Footer>
    );
  }

  _renderTransactionID() {
    const { theme } = this.props;
    const { transaction, message } = this.props.navigation.state.params;

    if (!transaction) {
      return null;
    }

    return (
      <View style={[styles.detail, theme.tableBorder]}>
        <StyledText style={[styles.label, theme.tableLabel]}>Transaction ID</StyledText>
        <AddressLabel address={message.txid} style={styles.value} textStyle={[styles.valueLabel, theme.text]} />
      </View>
    );
  }

  _renderTo() {
    const { theme } = this.props;
    const { message } = this.props.navigation.state.params;
    const address = message.address && message.address.address;

    if (!address) {
      return null;
    }

    return (
      <View style={[styles.detail, theme.tableBorder]}>
        <StyledText style={[styles.label, theme.tableLabel]}>To</StyledText>
        <AddressLabel address={address} style={styles.value} textStyle={[styles.valueLabel, theme.text]} />
      </View>
    );
  }

  _renderSentDate() {
    const { theme } = this.props;
    const { message } = this.props.navigation.state.params;
    const createdDate = new Date(message.createdAt * 1000);

    return (
      <View style={[styles.detail, theme.tableBorder]}>
        <StyledText style={[styles.label, theme.tableLabel]}>Sent</StyledText>
        <View style={styles.value}>
          <DateLabel date={createdDate} style={[styles.valueLabel, theme.text]} />
        </View>
      </View>
    );
  }

  render() {
    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <ScrollView style={styles.details}>
            { this._renderError() }
            { this._renderTransactionType() }
            { this._renderStatus() }
            { this._renderTransactionID() }
            { this._renderTo() }
            { this._renderSentDate() }
            { this._renderAmount() }
            { this._renderFee() }
            { this._renderTotal() }
          </ScrollView>
        </ContentView>

        { this._renderCancelButton() }
      </BaseScreen>
    );
  }
}

PaymentDetailsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  defaultBitcoinUnit: PropTypes.string,
  contact: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withTheme(PaymentDetailsScreen);
