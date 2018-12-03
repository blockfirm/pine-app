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

import headerStyles from '../styles/headerStyles';
import FakeNumberInput from '../components/FakeNumberInput';
import NumberPad from '../components/NumberPad';
import Button from '../components/Button';
import ContentView from '../components/ContentView';
import Footer from '../components/Footer';
import CancelButton from '../components/CancelButton';
import UnitPickerTitle from '../components/UnitPickerTitle';
import StyledText from '../components/StyledText';
import BaseScreen from './BaseScreen';

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
  confirmedBalance: state.bitcoin.wallet.confirmedBalance
}))
export default class EnterAmountScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { displayUnit } = navigation.state.params;

    const headerLeft = <CancelButton onPress={() => {
      screenProps.dismiss();
      StatusBar.setBarStyle('light-content');
    }}/>;

    return {
      headerTitle: <UnitPickerTitle unit={displayUnit} navigation={navigation} />,
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
    const { amountBtc, displayUnit } = this.props.navigation.state.params;

    if (amountBtc) {
      const amount = convertBitcoin(amountBtc, UNIT_BTC, displayUnit);
      const sanitizedAmount = this._sanitizeAmount(amount.toString());
      this._setAmount(sanitizedAmount);
    }

    StatusBar.setBarStyle('dark-content');
  }
  
  componentDidUpdate(prevProps) {
    const { amount } = this.state;
    const prevDisplayUnit = prevProps.navigation.state.params.displayUnit;
    const displayUnit = this.props.navigation.state.params.displayUnit;

    if (displayUnit !== prevDisplayUnit) {
      const sanitizedAmount = this._sanitizeAmount(amount);
      this._setAmount(sanitizedAmount);
    }
  }

  _enforceInputLengths(amount, unit) {
    if (!amount) {
      return amount;
    }

    const parts = amount.split('.');
    let integer = parts[0];
    let fractional = parts[1];
    
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

    if (fractional === undefined) {
      return integer;
    }

    return `${integer}.${fractional}`;
  }

  _sanitizeAmount(amount) {
    let sanitized = amount;

    const { displayUnit } = this.props.navigation.state.params;
    const lastChar = sanitized.slice(-1);
    const periods = sanitized.match(/\./g);
    const periodCount = periods ? periods.length : 0;

    // Only allow one decimal place.
    if (lastChar === '.' && periodCount > 1) {
      sanitized = sanitized.slice(0, -1);
    }

    // Add 0 if amount starts with period.
    if (sanitized === '.') {
      sanitized = '0.';
    }

    // Remove multiple leading zeros.
    sanitized = sanitized.replace(/^[00]+/, '0');

    // Remove zero before an integer.
    sanitized = sanitized.replace(/^[0]+([\d]+)/, '$1');

    // Last, enforce the length of the input.
    sanitized = this._enforceInputLengths(sanitized, displayUnit);

    return sanitized;
  }

  _checkBalance(amount) {
    const { confirmedBalance } = this.props;
    const { displayUnit } = this.props.navigation.state.params;
    const amountBtc = convertBitcoin(parseFloat(amount), displayUnit, UNIT_BTC);
    const insufficientFunds = confirmedBalance < amountBtc;

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
    const navigation = this.props.navigation;
    const { amount } = this.state;
    const { address, displayUnit } = navigation.state.params;
    const amountBtc = convertBitcoin(parseFloat(amount), displayUnit, UNIT_BTC);

    navigation.navigate('ReviewAndPay', {
      address,
      amountBtc,
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
    const disabled = insufficientFunds || parseFloat(amount || 0) === 0;
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
  confirmedBalance: PropTypes.number
};
