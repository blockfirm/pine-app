/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, TextInput, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

import { DECIMAL_SEPARATOR } from '../../localization';
import StyledText from '../StyledText';

import {
  UNIT_BTC,
  UNIT_MBTC,
  UNIT_SATOSHIS
} from '../../crypto/bitcoin/convert';

const CURRENCY_BTC = 'BTC';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F3F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25
  },
  input: {
    fontSize: 17,
    color: '#000000'
  },
  disabled: {
    color: '#999999'
  },
  error: {
    color: '#FF3B30'
  },
  errorText: {
    color: '#999999'
  }
});

const getAmountAsNumber = (amount) => {
  if (!amount) {
    return 0;
  }

  return parseFloat(amount.replace(DECIMAL_SEPARATOR, '.'));
};

const enforceInputLengths = (amount, currency, unit) => {
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
};

export default class AmountInput extends Component {
  state = {
    amount: ''
  }

  constructor() {
    super(...arguments);

    this._onChangeText = this._onChangeText.bind(this);
    this.focus = this.focus.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { amount } = this.state;
    const prevCurrency = prevProps.currency;
    const prevUnit = prevProps.unit;
    const { currency, unit, hasError } = this.props;

    if (unit !== prevUnit || currency !== prevCurrency) {
      const sanitizedAmount = this._sanitizeAmount(amount);
      this._setAmount(sanitizedAmount);
    }

    if (hasError !== prevProps.hasError) {
      const animation = LayoutAnimation.create(
        200,
        LayoutAnimation.Types['easeInEaseOut'],
        LayoutAnimation.Properties.opacity
      );

      LayoutAnimation.configureNext(animation);
    }
  }

  _sanitizeAmount(amount) {
    let sanitized = amount.replace(/[^0-9,.]/g, '');

    sanitized = sanitized.replace(/\./g, DECIMAL_SEPARATOR);

    const { currency, unit } = this.props;
    const lastChar = sanitized.slice(-1);
    const periods = sanitized.match(DECIMAL_SEPARATOR);
    const periodCount = periods ? periods.length : 0;

    // Only allow one decimal place.
    if (lastChar === DECIMAL_SEPARATOR && periodCount > 1) {
      sanitized = sanitized.slice(0, -1);
    }

    // Add 0 if amount starts with period.
    if (sanitized === DECIMAL_SEPARATOR) {
      sanitized = `0${DECIMAL_SEPARATOR}`;
    }

    // Remove multiple leading zeros.
    sanitized = sanitized.replace(/^[00]+/, '0');

    // Remove zero before an integer.
    sanitized = sanitized.replace(/^[0]+([\d]+)/, '$1');

    // Last, enforce the length of the input.
    sanitized = enforceInputLengths(sanitized, currency, unit);

    return sanitized;
  }

  _setAmount(amount) {
    this.setState({ amount });
    this.props.onChangeAmount(getAmountAsNumber(amount));
  }

  _onChangeText(text) {
    const sanitizedAmount = this._sanitizeAmount(text);
    this._setAmount(sanitizedAmount);
  }

  focus() {
    this._input.focus();
  }

  reset() {
    this.setState({ amount: '' });
  }

  _renderErrorText() {
    const { hasError, errorText } = this.props;

    if (!hasError) {
      return null;
    }

    return (
      <StyledText style={styles.errorText}>
        {errorText}
      </StyledText>
    );
  }

  render() {
    const style = [
      styles.input,
      this.props.hasError ? styles.error : null,
      !this.props.editable ? styles.disabled : null
    ];

    return (
      <TouchableWithoutFeedback onPress={this.focus}>
        <View style={styles.container}>
          <TextInput
            {...this.props}
            ref={(ref) => { this._input = ref; }}
            style={style}
            keyboardType='decimal-pad'
            autoCorrect={false}
            value={this.state.amount}
            placeholder='Enter Amount'
            placeholderTextColor='#999999'
            selectionColor='#FFC431'
            enablesReturnKeyAutomatically={true}
            onChangeText={this._onChangeText}
          />
          { this._renderErrorText() }
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

AmountInput.propTypes = {
  onChangeAmount: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  unit: PropTypes.string,
  hasError: PropTypes.bool,
  errorText: PropTypes.string
};
