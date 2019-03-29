import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import AmountInput from './AmountInput';
import UnitPicker from './UnitPicker';
import SendButton from './SendButton';
import CancelButton from './CancelButton';

import {
  UNIT_BTC,
  convert as convertBitcoin
} from '../../crypto/bitcoin/convert';

const CURRENCY_BTC = 'BTC';

const styles = StyleSheet.create({
  toolbar: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  unitPicker: {
    position: 'absolute',
    right: 63
  },
  sendButton: {
    position: 'absolute',
    right: 22
  },
  cancelButton: {
    position: 'absolute',
    right: 22
  }
});

export default class InputBar extends Component {
  constructor(props) {
    super(...arguments);

    const { primaryCurrency, defaultBitcoinUnit } = props;

    this.state = {
      amount: 0,
      currency: primaryCurrency,
      unit: primaryCurrency === CURRENCY_BTC ? defaultBitcoinUnit : null,
      insufficientFunds: false,
      confirmTransaction: false
    };

    this._onChangeAmount = this._onChangeAmount.bind(this);
    this._onChangeUnit = this._onChangeUnit.bind(this);
    this._onSendPress = this._onSendPress.bind(this);
    this._onCancelPress = this._onCancelPress.bind(this);
  }

  _onChangeAmount(amount) {
    this.setState({ amount });
    this._checkBalance(amount);
  }

  _onChangeUnit({ currency, unit }) {
    this.setState({ currency, unit });
  }

  _getBtcAmount(amount) {
    const { currency, unit } = this.state;
    let amountBtc = 0;

    if (currency === CURRENCY_BTC) {
      amountBtc = convertBitcoin(amount, unit, UNIT_BTC);
    } else {
      const fiatRate = this.props.fiatRates[currency];
      amountBtc = fiatRate ? (amount / fiatRate) : 0;
    }

    return amountBtc;
  }

  _checkBalance(amount) {
    const { spendableBalance } = this.props;
    const amountBtc = this._getBtcAmount(amount);
    const insufficientFunds = amountBtc > spendableBalance;

    this.setState({ insufficientFunds });
  }

  _onSendPress() {
    const amountBtc = this._getBtcAmount(this.state.amount);
    const displayUnit = this.state.unit || this.props.defaultBitcoinUnit;

    this.setState({ confirmTransaction: true });
    this.props.onSendPress({ amountBtc, displayUnit });
  }

  _onCancelPress() {
    this.setState({ confirmTransaction: false }, () => {
      this.props.onCancelPress();
      this._amountInput.focus();
    });
  }

  _renderButton() {
    const { amount, insufficientFunds, confirmTransaction } = this.state;
    const sendDisabled = !amount || insufficientFunds;

    if (confirmTransaction) {
      return (
        <CancelButton
          style={styles.cancelButton}
          onPress={this._onCancelPress}
        />
      );
    }

    return (
      <SendButton
        disabled={sendDisabled}
        style={styles.sendButton}
        onPress={this._onSendPress}
      />
    );
  }

  reset() {
    const { primaryCurrency, defaultBitcoinUnit } = this.props;

    this.setState({
      amount: 0,
      currency: primaryCurrency,
      unit: primaryCurrency === CURRENCY_BTC ? defaultBitcoinUnit : null,
      insufficientFunds: false,
      confirmTransaction: false
    });

    this._amountInput.reset();
  }

  render() {
    const { primaryCurrency, secondaryCurrency } = this.props;
    const { currency, unit, insufficientFunds, confirmTransaction } = this.state;

    return (
      <View style={styles.toolbar}>
        <AmountInput
          ref={(ref) => { this._amountInput = ref; }}
          currency={currency}
          unit={unit}
          onChangeAmount={this._onChangeAmount}
          hasError={insufficientFunds}
          editable={!confirmTransaction}
        />
        <UnitPicker
          primaryCurrency={primaryCurrency}
          secondaryCurrency={secondaryCurrency}
          currency={currency}
          unit={unit}
          onChangeUnit={this._onChangeUnit}
          style={styles.unitPicker}
          disabled={confirmTransaction}
        />
        { this._renderButton() }
      </View>
    );
  }
}

InputBar.propTypes = {
  primaryCurrency: PropTypes.string.isRequired,
  secondaryCurrency: PropTypes.string.isRequired,
  defaultBitcoinUnit: PropTypes.string.isRequired,
  spendableBalance: PropTypes.number.isRequired,
  fiatRates: PropTypes.object.isRequired,
  onSendPress: PropTypes.func.isRequired,
  onCancelPress: PropTypes.func.isRequired
};
