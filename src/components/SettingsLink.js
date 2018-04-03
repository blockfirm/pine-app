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
  value: {
    position: 'absolute',
    top: 12,
    right: 30,
    color: '#8F8E94',
    textAlign: 'right',
    width: 230,
    backgroundColor: 'transparent'
  },
  chevron: {
    position: 'absolute',
    top: 11,
    right: 15,
    fontSize: 20,
    color: '#D1D1D6'
  }
});

export default class SettingsLink extends Component {
  render() {
    const isLastItem = this.props.isLastItem;

    const containerStyles = [
      styles.container,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor='#FAFAFA'>
        <View style={containerStyles}>
          <StyledText style={styles.label}>{this.props.name}</StyledText>
          <StyledText style={styles.value} numberOfLines={1}>{this.props.value}</StyledText>
          <Icon name='ios-arrow-forward' style={styles.chevron} />
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsLink.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  value: PropTypes.string,
  isLastItem: PropTypes.bool
};
