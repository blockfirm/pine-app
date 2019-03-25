import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import AmountInput from './AmountInput';
import UnitPicker from './UnitPicker';
import SendButton from './SendButton';

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
  }
});

export default class InputBar extends Component {
  constructor(props) {
    super(...arguments);

    const { primaryCurrency, defaultBitcoinUnit } = props;

    this.state = {
      amount: 0,
      currency: primaryCurrency,
      unit: primaryCurrency === CURRENCY_BTC ? defaultBitcoinUnit : null
    };

    this._onChangeAmount = this._onChangeAmount.bind(this);
    this._onChangeUnit = this._onChangeUnit.bind(this);
  }

  _onChangeAmount(amount) {
    this.setState({ amount });
  }

  _onChangeUnit({ currency, unit }) {
    this.setState({ currency, unit });
  }

  render() {
    const { primaryCurrency, secondaryCurrency } = this.props;
    const { amount, currency, unit } = this.state;
    const buttonDisabled = !amount;

    return (
      <View style={styles.toolbar}>
        <AmountInput
          currency={currency}
          unit={unit}
          onChangeAmount={this._onChangeAmount}
        />
        <UnitPicker
          primaryCurrency={primaryCurrency}
          secondaryCurrency={secondaryCurrency}
          currency={currency}
          unit={unit}
          onChangeUnit={this._onChangeUnit}
          style={styles.unitPicker}
        />
        <SendButton disabled={buttonDisabled} style={styles.sendButton} />
      </View>
    );
  }
}

InputBar.propTypes = {
  primaryCurrency: PropTypes.string.isRequired,
  secondaryCurrency: PropTypes.string.isRequired,
  defaultBitcoinUnit: PropTypes.string.isRequired
};
