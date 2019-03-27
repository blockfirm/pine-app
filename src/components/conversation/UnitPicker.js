import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import StyledText from '../StyledText';

import {
  UNIT_BTC,
  UNIT_MBTC,
  UNIT_SATOSHIS
} from '../../crypto/bitcoin/convert';

const CURRENCY_BTC = 'BTC';
const UNITS = [UNIT_BTC, UNIT_MBTC, UNIT_SATOSHIS];

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15
  },
  title: {
    color: '#999999',
    fontSize: 15,
    fontWeight: '500'
  },
  arrow: {
    color: '#999999',
    position: 'absolute',
    right: 0,
    fontSize: 15,
    paddingTop: 9.5
  },
  disabled: {
    opacity: 0.75
  }
});

export default class UnitPicker extends Component {
  _showOptions() {
    const denominations = new Set(UNITS);

    denominations.add(this.props.primaryCurrency);
    denominations.add(this.props.secondaryCurrency);

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

    if (UNITS.indexOf(denomination) > -1) {
      currency = CURRENCY_BTC;
      unit = denomination;
    } else {
      currency = denomination;
      unit = null;
    }

    this.props.onChangeUnit({ currency, unit });
  }

  render() {
    const { currency, unit, disabled } = this.props;
    const title = currency === CURRENCY_BTC ? unit : currency;

    const style = [
      this.props.style,
      disabled && styles.disabled
    ];

    return (
      <TouchableOpacity onPress={this._showOptions.bind(this)} disabled={disabled} style={style}>
        <View style={styles.wrapper}>
          <StyledText style={styles.title}>{title}</StyledText>
          <Icon name='ios-arrow-down' style={styles.arrow} />
        </View>
      </TouchableOpacity>
    );
  }
}

UnitPicker.propTypes = {
  onChangeUnit: PropTypes.func.isRequired,
  primaryCurrency: PropTypes.string.isRequired,
  secondaryCurrency: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  unit: PropTypes.string,
  style: PropTypes.any,
  disabled: PropTypes.bool
};
