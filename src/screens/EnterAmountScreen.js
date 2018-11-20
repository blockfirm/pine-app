import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ReactNativeHaptic from 'react-native-haptic';

import headerStyles from '../styles/headerStyles';
import FakeNumberInput from '../components/FakeNumberInput';
import NumberPad from '../components/NumberPad';
import Button from '../components/Button';
import ContentView from '../components/ContentView';
import Footer from '../components/Footer';
import CancelButton from '../components/CancelButton';
import UnitPickerTitle from '../components/UnitPickerTitle';
import BaseScreen from './BaseScreen';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';
const UNIT_SATOSHIS = 'Satoshis';

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
  }
});

@connect()
export default class EnterAmountScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { unit } = navigation.state.params;

    const headerLeft = <CancelButton onPress={() => {
      screenProps.dismiss();
      StatusBar.setBarStyle('light-content');
    }}/>;

    return {
      headerTitle: <UnitPickerTitle unit={unit} navigation={navigation} />,
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft
    };
  };

  state = {
    amount: ''
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
  }
  
  componentDidUpdate(prevProps) {
    const { amount } = this.state;
    const prevUnit = prevProps.navigation.state.params.unit;
    const unit = this.props.navigation.state.params.unit;

    if (unit !== prevUnit) {
      this.setState({
        amount: this._sanitizeAmount(amount)
      });
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

    const { unit } = this.props.navigation.state.params;
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
    sanitized = this._enforceInputLengths(sanitized, unit);

    return sanitized;
  }

  _onInput(value) {
    const amount = this.state.amount + value;

    this.setState({ 
      amount: this._sanitizeAmount(amount)
    });
  }
  
  _onDelete(isLongPress) {
    const { amount } = this.state;

    if (isLongPress && amount.length > 0) {
      ReactNativeHaptic.generate('selection');
      return this.setState({ amount: '' });
    }

    this.setState({
      amount: amount.slice(0, -1)
    });
  }

  render() {
    const { amount } = this.state;
    const disabled = parseFloat(amount || 0) === 0;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <FakeNumberInput value={amount} style={styles.input} />
          <Button label='Review and Pay' disabled={disabled} onPress={() => {}} />
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
  navigation: PropTypes.object
};
