/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ReactNativeHaptic from 'react-native-haptic';

import {
  UNIT_BTC,
  UNIT_MBTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../crypto/bitcoin/convert';

import { handle as handleError } from '../actions/error';
import headerStyles from '../styles/headerStyles';
import UnitPickerTitleContainer from '../containers/UnitPickerTitleContainer';
import FakeNumberInput from '../components/FakeNumberInput';
import NumberPad from '../components/NumberPad';
import Button from '../components/Button';
import ContentView from '../components/ContentView';
import Footer from '../components/Footer';
import CancelButton from '../components/CancelButton';
import StyledText from '../components/StyledText';
import { DECIMAL_SEPARATOR } from '../localization';
import BaseScreen from './BaseScreen';

const CURRENCY_BTC = 'BTC';
const ERROR_COLOR = '#FF3B30';

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 30
  },
  input: {
    marginBottom: 50
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 70
  }
});

@connect((state) => ({
  spendableBalance: state.bitcoin.wallet.spendableBalance,
  fiatRates: state.bitcoin.fiat.rates
}))
export default class EnterAmountScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { displayCurrency, displayUnit } = navigation.state.params;

    const headerLeft = <CancelButton onPress={() => {
      screenProps.dismiss();
      StatusBar.setBarStyle('light-content');
    }}/>;

    return {
      headerTitle: <UnitPickerTitleContainer currency={displayCurrency} unit={displayUnit} navigation={navigation} />,
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft
    };
  };

  state = {
    amount: '',
    insufficientFunds: false
  }

  componentDidMount() {
    const { amountBtc, displayCurrency, displayUnit } = this.props.navigation.state.params;

    if (amountBtc && displayUnit) {
      const amount = convertBitcoin(amountBtc, UNIT_BTC, displayUnit);
      const sanitizedAmount = this._sanitizeAmount(amount.toString());
      this._setAmount(sanitizedAmount);
    }

    StatusBar.setBarStyle('dark-content');
  }

  componentDidUpdate(prevProps) {
    const { amount } = this.state;
    const prevDisplayCurrency = prevProps.navigation.state.params.displayCurrency;
    const displayCurrency = this.props.navigation.state.params.displayCurrency;
    const prevDisplayUnit = prevProps.navigation.state.params.displayUnit;
    const displayUnit = this.props.navigation.state.params.displayUnit;

    if (displayUnit !== prevDisplayUnit || displayCurrency !== prevDisplayCurrency) {
      const sanitizedAmount = this._sanitizeAmount(amount);
      this._setAmount(sanitizedAmount);
    }
  }

  _getNormalizedAmount(amount) {
    if (!amount) {
      return 0;
    }

    return parseFloat(amount.replace(DECIMAL_SEPARATOR, '.'));
  }

  _getBtcAmount(amount) {
    const normalizedAmount = this._getNormalizedAmount(amount);
    const { displayCurrency, displayUnit } = this.props.navigation.state.params;
    let amountBtc = 0;

    if (displayCurrency === CURRENCY_BTC) {
      amountBtc = convertBitcoin(normalizedAmount, displayUnit, UNIT_BTC);
    } else {
      const fiatRate = this.props.fiatRates[displayCurrency];
      amountBtc = fiatRate ? (normalizedAmount / fiatRate) : 0;
    }

    return amountBtc;
  }

  _enforceInputLengths(amount, currency, unit) {
    if (!amount) {
      return amount;
    }

    const parts = amount.split(DECIMAL_SEPARATOR);
    let integer = parts[0];
    let fractional = parts[1];

    if (currency === CURRENCY_BTC) {
      switch (unit) {
        case UNIT_BTC:
          integer = integer.slice(0, 8);
          fractional = fractional && fractional.slice(0, 8);
          break;

        case UNIT_MBTC:
          integer = integer.slice(0, 11);
          fractional = fractional && fractional.slice(0, 5);
          break;

        case UNIT_SATOSHIS:
          integer = integer.slice(0, 16);
          integer = integer === '0' ? '' : integer;
          fractional = undefined;
          break;
      }
    } else {
      integer = integer.slice(0, 10);
      fractional = fractional && fractional.slice(0, 2);
    }

    if (fractional === undefined) {
      return integer;
    }

    return `${integer}${DECIMAL_SEPARATOR}${fractional}`;
  }

  _sanitizeAmount(amount) {
    let sanitized = amount.replace('.', DECIMAL_SEPARATOR);

    const { displayCurrency, displayUnit } = this.props.navigation.state.params;
    const lastChar = sanitized.slice(-1);
    const periods = sanitized.match(DECIMAL_SEPARATOR);
    const periodCount = periods ? periods.length : 0;

    // Only allow one decimal place.
    if (lastChar === DECIMAL_SEPARATOR && periodCount > 1) {
      sanitized = sanitized.slice(0, -1);
    }

    // Add 0 if amount starts with period.
    if (sanitized === DECIMAL_SEPARATOR) {
      sanitized = '0' + DECIMAL_SEPARATOR;
    }

    // Remove multiple leading zeros.
    sanitized = sanitized.replace(/^[00]+/, '0');

    // Remove zero before an integer.
    sanitized = sanitized.replace(/^[0]+([\d]+)/, '$1');

    // Last, enforce the length of the input.
    sanitized = this._enforceInputLengths(sanitized, displayCurrency, displayUnit);

    return sanitized;
  }

  _checkBalance(amount) {
    const { spendableBalance } = this.props;
    const amountBtc = this._getBtcAmount(amount);
    const insufficientFunds = amountBtc > spendableBalance;

    this.setState({ insufficientFunds });
  }

  _setAmount(amount) {
    this._checkBalance(amount);
    this.setState({ amount });
  }

  _onInput(value) {
    const amount = `${this.state.amount}${value}`;
    const sanitizedAmount = this._sanitizeAmount(amount);

    this._setAmount(sanitizedAmount);
  }

  _onDelete(isLongPress) {
    let amount = this.state.amount;

    if (isLongPress && amount.length > 0) {
      ReactNativeHaptic.generate('selection');
      amount = '';
    } else {
      amount = amount.slice(0, -1);
    }

    this._setAmount(amount);
  }

  _onPaste(value) {
    const amount = this._sanitizeAmount(value);
    this._setAmount(amount);
  }

  _reviewAndPay() {
    const { dispatch, navigation } = this.props;
    const { amount } = this.state;
    const { address, displayCurrency, displayUnit } = navigation.state.params;
    const amountBtc = this._getBtcAmount(amount);

    if (!amountBtc && displayCurrency !== CURRENCY_BTC) {
      return dispatch(handleError(
        new Error(`Unable to get BTC/${displayCurrency} exchange rate. Please try again later.`)
      ));
    }

    navigation.navigate('ReviewAndPay', {
      address,
      amountBtc,
      displayCurrency,
      displayUnit
    });
  }

  _renderError() {
    const { insufficientFunds } = this.state;

    if (insufficientFunds) {
      return (
        <StyledText style={styles.errorText}>
          You don't have enough confirmed funds to send this amount.
        </StyledText>
      );
    }

    return null;
  }

  render() {
    const { amount, insufficientFunds } = this.state;
    const disabled = insufficientFunds || this._getNormalizedAmount(amount) === 0;
    const textColor = insufficientFunds ? ERROR_COLOR : undefined;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <FakeNumberInput
            value={amount}
            style={styles.input}
            color={textColor}
            onPaste={this._onPaste.bind(this)}
          />
          {this._renderError()}
          <Button label='Review and Pay' disabled={disabled} onPress={this._reviewAndPay.bind(this)} />
        </ContentView>

        <NumberPad
          onInput={this._onInput.bind(this)}
          onDelete={this._onDelete.bind(this)}
        />
      </BaseScreen>
    );
  }
}

EnterAmountScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.object,
  spendableBalance: PropTypes.number,
  fiatRates: PropTypes.object
};
