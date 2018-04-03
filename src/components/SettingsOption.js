import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    marginLeft: 15,
    borderBottomColor: '#C8C7CC',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  label: {
    fontWeight: '400'
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 15,
    fontSize: 28,
    color: '#007AFF'
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
      styles.container,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <TouchableHighlight onPress={this._onPress.bind(this)} underlayColor='#FAFAFA'>
        <View style={containerStyles}>
          <StyledText style={styles.label}>{name}</StyledText>
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
