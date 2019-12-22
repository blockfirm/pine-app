import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme';

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
    fontSize: 17
  }
});

class SettingsInput extends Component {
  render() {
    const { theme } = this.props;

    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.input, theme.settingsInput]}
          value={this.props.value}
          placeholder={this.props.placeholder}
          clearButtonMode='always'
          autoFocus={true}
          keyboardType={this.props.keyboardType}
          returnKeyType='done'
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          maxLength={this.props.maxLength}
          editable={!this.props.disabled}
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
  maxLength: PropTypes.number,
  disabled: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsInput);
