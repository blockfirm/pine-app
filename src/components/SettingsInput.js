import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    paddingLeft: 15
  },
  input: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: 17,
    color: '#000000'
  }
});

export default class SettingsInput extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.props.value}
          placeholder={this.props.placeholder}
          placeholderTextColor='#8E8E93'
          selectionColor='#426BF2'
          clearButtonMode='always'
          autoFocus={true}
          keyboardType={this.props.keyboardType}
          returnKeyType='done'
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          maxLength={this.props.maxLength}
        />
      </View>
    );
  }
}

SettingsInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  maxLength: PropTypes.number
};
