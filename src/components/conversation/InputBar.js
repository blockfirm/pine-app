import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import AmountInput from './AmountInput';
import SendButton from './SendButton';

const styles = StyleSheet.create({
  toolbar: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  sendButton: {
    position: 'absolute',
    right: 22
  }
});

export default class InputBar extends Component {
  state = {
    amount: 0
  }

  constructor() {
    super(...arguments);
    this._onChangeAmount = this._onChangeAmount.bind(this);
  }

  _onChangeAmount(amount) {
    this.setState({ amount });
  }

  render() {
    const buttonDisabled = !this.state.amount;

    return (
      <View style={styles.toolbar}>
        <AmountInput displayCurrency='BTC' displayUnit='BTC' onChangeAmount={this._onChangeAmount} />
        <SendButton disabled={buttonDisabled} style={styles.sendButton} />
      </View>
    );
  }
}
