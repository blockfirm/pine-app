import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F3F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25
  },
  input: {
    fontSize: 15,
    color: '#000000'
  }
});

export default class AmountInput extends Component {
  state = {
    value: ''
  }

  constructor() {
    super(...arguments);
    this._onChangeText = this._onChangeText.bind(this);
  }

  _onChangeText(value) {
    this.setState({ value });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          {...this.props}
          style={styles.input}
          keyboardType='decimal-pad'
          autoCorrect={false}
          value={this.state.value}
          placeholder='Enter Amount'
          placeholderTextColor='#999999'
          selectionColor='#FFD23F'
          enablesReturnKeyAutomatically={true}
          onChangeText={this._onChangeText}
        />
      </View>
    );
  }
}
