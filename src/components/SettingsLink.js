import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  value: {
    right: 35
  },
  chevron: {
    position: 'absolute',
    right: 15,
    fontSize: 20,
    color: '#C7C7CC',
    paddingTop: 2
  }
});

export default class SettingsLink extends Component {
  render() {
    const isLastItem = this.props.isLastItem;

    const containerStyles = [
      settingsStyles.item,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor='#FAFAFA'>
        <View style={containerStyles}>
          <StyledText style={settingsStyles.label}>{this.props.name}</StyledText>
          <StyledText style={[settingsStyles.value, styles.value]} numberOfLines={1}>{this.props.value}</StyledText>
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
