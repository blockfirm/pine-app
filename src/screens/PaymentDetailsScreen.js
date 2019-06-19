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

import { cancelPayment } from '../actions/messages';
import { handle as handleError } from '../actions/error';
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
  },
  footer: {
    left: 0,
    right: 0
  },
  cancel: {
    color: '#FF3B30',
    fontWeight: '400'
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

  _getStatus() {
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

  _getStatusText() {
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
    const { message, transaction } = this.props.navigation.state.params;
    const title = message.from ? 'Amount Received' : 'Amount Sent';

    const style = [
      styles.detail,
      message.from && styles.lastDetail
    ];

    if (message.canceled && !transaction) {
      return null;
    }

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

  _renderCancelButton() {
    const { message, transaction } = this.props.navigation.state.params;
    const { cancelling } = this.state;

    if (transaction || message.from || message.canceled) {
      return null;
    }

    if (cancelling) {
      return (
        <Footer style={styles.footer}>
          <ActivityIndicator animating={true} size='small' />
        </Footer>
      );
    }

    return (
      <Footer style={styles.footer}>
        <Link onPress={this._showCancelConfirmation} labelStyle={styles.cancel}>
          Cancel Payment
        </Link>
      </Footer>
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

        { this._renderCancelButton() }
      </BaseScreen>
    );
  }
}

PaymentDetailsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  defaultBitcoinUnit: PropTypes.string,
  contact: PropTypes.object
};
