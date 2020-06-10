/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, TextInput, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../../contexts/theme';
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
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25
  },
  containerWithErrorText: {
    borderRadius: 18
  },
  input: {
    fontSize: 17
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

class AmountInput extends Component {
  state = {
    amount: ''
  }

  constructor() {
    super(...arguments);

    this._onChangeText = this._onChangeText.bind(this);
    this.focus = this.focus.bind(this);
  }

  componentDidMount() {
    const { initialAmount } = this.props;

    if (initialAmount) {
      this._onChangeText(initialAmount.toFixed(8));
      this.focus();
    }
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

  focus() {
    this._input.focus();
  }

  reset() {
    this.setState({ amount: '' });
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

  _renderErrorText() {
    const { hasError, errorText, theme } = this.props;

    if (!hasError) {
      return null;
    }

    return (
      <StyledText style={theme.inputBarDisabledText}>
        {errorText}
      </StyledText>
    );
  }

  render() {
    const { editable, hasError, errorText, onPress, theme } = this.props;

    const containerStyle = [
      styles.container,
      theme.inputBar,
      errorText ? styles.containerWithErrorText : null
    ];

    const style = [
      styles.input,
      theme.inputBarText,
      hasError ? theme.inputBarErrorText : null,
      !editable ? theme.inputBarDisabledText : null
    ];

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={containerStyle}>
          <TextInput
            {...this.props}
            ref={(ref) => { this._input = ref; }}
            style={style}
            keyboardType='decimal-pad'
            autoCorrect={false}
            value={this.state.amount}
            placeholder='Enter Amount'
            placeholderTextColor={theme.inputBarPlaceholderColor}
            selectionColor={theme.inputBarSelectionColor}
            enablesReturnKeyAutomatically={true}
            onChangeText={this._onChangeText}
            pointerEvents={editable ? undefined : 'none'}
          />
          { this._renderErrorText() }
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

AmountInput.propTypes = {
  onChangeAmount: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  unit: PropTypes.string,
  initialAmount: PropTypes.number,
  hasError: PropTypes.bool,
  errorText: PropTypes.string,
  editable: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(AmountInput);
