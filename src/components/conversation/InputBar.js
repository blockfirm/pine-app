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
  render() {
    return (
      <View style={styles.toolbar}>
        <AmountInput />
        <SendButton disabled={true} style={styles.sendButton} />
      </View>
    );
  }
}
