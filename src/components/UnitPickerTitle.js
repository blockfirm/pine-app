import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import headerStyles from '../styles/headerStyles';
import StyledText from './StyledText';

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
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Pick a Unit:',
      options: ['Cancel', ...UNITS],
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      if (buttonIndex !== 0) {
        const unit = UNITS[buttonIndex - 1];
        this.props.navigation.setParams({ displayUnit: unit });
      }
    });
  }

  render() {
    const { unit } = this.props;

    return (
      <TouchableOpacity onPress={this._showOptions.bind(this)}>
        <View style={styles.wrapper}>
          <StyledText style={headerStyles.title}>{unit}</StyledText>
          <Icon name='ios-arrow-down' style={styles.arrow} />
        </View>
      </TouchableOpacity>
    );
  }
}

UnitPickerTitle.propTypes = {
  navigation: PropTypes.object,
  unit: PropTypes.string
};
