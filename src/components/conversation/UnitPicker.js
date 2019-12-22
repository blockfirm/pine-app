import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import { withTheme } from '../../contexts/theme';
import StyledText from '../StyledText';

import {
  UNIT_BTC,
  UNIT_MBTC,
  UNIT_SATOSHIS
} from '../../crypto/bitcoin/convert';

const CURRENCY_BTC = UNIT_BTC;
const BTC_UNITS = [UNIT_BTC, UNIT_MBTC, UNIT_SATOSHIS];

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 15,
    paddingRight: 25
  },
  title: {
    fontSize: 15,
    fontWeight: '500'
  },
  arrow: {
    position: 'absolute',
    right: 10,
    fontSize: 15,
    paddingTop: 12.5
  },
  disabled: {
    opacity: 0.75
  }
});

const getDenominationsForCurrency = (currency, defaultBitcoinUnit) => {
  const denominations = [];

  if (currency === CURRENCY_BTC) {
    denominations.push(defaultBitcoinUnit);

    if (defaultBitcoinUnit !== CURRENCY_BTC) {
      denominations.push(CURRENCY_BTC);
    }
  } else {
    denominations.push(currency);
  }

  return denominations;
};

class UnitPicker extends Component {
  _getDenominations() {
    const { primaryCurrency, secondaryCurrency, defaultBitcoinUnit } = this.props;

    return [
      ...getDenominationsForCurrency(primaryCurrency, defaultBitcoinUnit),
      ...getDenominationsForCurrency(secondaryCurrency, defaultBitcoinUnit)
    ];
  }

  _showOptions() {
    const denominations = this._getDenominations();
    const options = ['Cancel', ...denominations];

    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Pick Denomination Unit:',
      cancelButtonIndex: 0,
      options
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        return; // Cancel
      }

      const denomination = options[buttonIndex];
      this._onChangeUnit(denomination);
    });
  }

  _onChangeUnit(denomination) {
    let currency;
    let unit;

    if (BTC_UNITS.indexOf(denomination) > -1) {
      currency = CURRENCY_BTC;
      unit = denomination;
    } else {
      currency = denomination;
      unit = null;
    }

    this.props.onChangeUnit({ currency, unit });
  }

  render() {
    const { currency, unit, disabled, theme } = this.props;
    const title = currency === CURRENCY_BTC ? unit : currency;

    const style = [
      this.props.style,
      disabled && styles.disabled
    ];

    return (
      <TouchableOpacity onPress={this._showOptions.bind(this)} disabled={disabled} style={style}>
        <View style={styles.wrapper}>
          <StyledText style={[theme.unitPicker, styles.title]}>{title}</StyledText>
          <Icon name='ios-arrow-down' style={[theme.unitPicker, styles.arrow]} />
        </View>
      </TouchableOpacity>
    );
  }
}

UnitPicker.propTypes = {
  onChangeUnit: PropTypes.func.isRequired,
  primaryCurrency: PropTypes.string.isRequired,
  secondaryCurrency: PropTypes.string.isRequired,
  defaultBitcoinUnit: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  unit: PropTypes.string,
  style: PropTypes.any,
  disabled: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(UnitPicker);
