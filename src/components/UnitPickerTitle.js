import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import headerStyles from '../styles/headerStyles';
import StyledText from './StyledText';

const CURRENCY_BTC = 'BTC';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';
const UNIT_SATOSHIS = 'Satoshis';
const UNITS = [UNIT_BTC, UNIT_MBTC, UNIT_SATOSHIS];

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15
  },
  arrow: {
    position: 'absolute',
    right: 0,
    fontSize: 15,
    paddingTop: 10.5
  }
});

export default class UnitPickerTitle extends Component {
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
      this._updateNavigationParams(denomination);
    });
  }

  _updateNavigationParams(denomination) {
    if (UNITS.indexOf(denomination) > -1) {
      this.props.navigation.setParams({
        displayCurrency: CURRENCY_BTC,
        displayUnit: denomination
      });
    } else {
      this.props.navigation.setParams({
        displayCurrency: denomination,
        displayUnit: null
      });
    }
  }

  render() {
    const { currency, unit } = this.props;
    const title = currency === CURRENCY_BTC ? unit : currency;

    return (
      <TouchableOpacity onPress={this._showOptions.bind(this)}>
        <View style={styles.wrapper}>
          <StyledText style={headerStyles.title}>{title}</StyledText>
          <Icon name='ios-arrow-down' style={styles.arrow} />
        </View>
      </TouchableOpacity>
    );
  }
}

UnitPickerTitle.propTypes = {
  navigation: PropTypes.object,
  primaryCurrency: PropTypes.string,
  secondaryCurrency: PropTypes.string,
  currency: PropTypes.string,
  unit: PropTypes.string
};
