import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const ICON_GEAR = 'Gear';
const ICON_LOCK = 'Lock';
const ICON_BITCOIN = 'Bitcoin';

const ICON_IMAGES = {
  [ICON_GEAR]: require('../images/icons/settings/Gear.png'),
  [ICON_LOCK]: require('../images/icons/settings/Lock.png'),
  [ICON_BITCOIN]: require('../images/icons/settings/Bitcoin.png')
};

const styles = StyleSheet.create({
  containerWithIcon: {
    marginLeft: 59
  },
  icon: {
    width: 29,
    height: 29,
    position: 'absolute',
    left: -44
  },
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
  static ICON_GEAR = ICON_GEAR;
  static ICON_LOCK = ICON_LOCK;
  static ICON_BITCOIN = ICON_BITCOIN;

  _renderIcon() {
    const iconName = this.props.icon;
    const image = ICON_IMAGES[iconName];

    if (!image) {
      return;
    }

    return (
      <Image source={image} style={styles.icon} />
    );
  }

  render() {
    const isLastItem = this.props.isLastItem;
    const icon = this._renderIcon();

    const containerStyles = [
      settingsStyles.item,
      icon ? styles.containerWithIcon : undefined,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor={settingsStyles.underlayColor}>
        <View style={containerStyles}>
          { icon }
          <StyledText style={settingsStyles.label}>{this.props.name}</StyledText>
          <StyledText style={[settingsStyles.value, styles.value]} numberOfLines={1}>{this.props.value}</StyledText>
          <Icon name='ios-arrow-forward' style={styles.chevron} />
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsLink.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  value: PropTypes.string,
  isLastItem: PropTypes.bool
};
