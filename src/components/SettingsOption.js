import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  checkmark: {
    position: 'absolute',
    right: 15,
    fontSize: 28,
    color: '#007AFF',
    paddingTop: 2
  }
});

export default class SettingsOption extends Component {
  _onPress() {
    this.props.onSelect(this.props.name);
  }

  render() {
    const { name, value, isLastItem } = this.props;
    const isChecked = value.toLowerCase() === name.toLowerCase();

    const containerStyles = [
      settingsStyles.item,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <TouchableHighlight onPress={this._onPress.bind(this)} underlayColor={settingsStyles.underlayColor}>
        <View style={containerStyles}>
          <StyledText style={settingsStyles.label}>{name}</StyledText>
          {isChecked ? <Icon name='ios-checkmark' style={styles.checkmark} /> : null}
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsOption.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  isLastItem: PropTypes.bool
};
