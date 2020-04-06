import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Image } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import { withTheme } from '../contexts/theme';
import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const ICON_GEAR = 'Gear';
const ICON_BITCOIN = 'Bitcoin';
const ICON_LIGHTNING = 'Lightning';
const ICON_BETA = 'Beta';

const ICON_IMAGES = {
  [ICON_GEAR]: require('../images/icons/settings/Gear.png'),
  [ICON_BITCOIN]: require('../images/icons/settings/Bitcoin.png'),
  [ICON_LIGHTNING]: require('../images/icons/settings/Lightning.png'),
  [ICON_BETA]: require('../images/icons/settings/Beta.png')
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
    paddingTop: 2
  }
});

class SettingsLink extends Component {
  static ICON_GEAR = ICON_GEAR;
  static ICON_BITCOIN = ICON_BITCOIN;
  static ICON_LIGHTNING = ICON_LIGHTNING;
  static ICON_BETA = ICON_BETA;

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
    const { isLastItem, labelStyle, theme } = this.props;
    const icon = this._renderIcon();

    const containerStyles = [
      settingsStyles.item,
      theme.settingsItem,
      icon ? styles.containerWithIcon : undefined,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor={theme.settingsUnderlayColor}>
        <View style={containerStyles}>
          { icon }
          <StyledText style={[settingsStyles.label, labelStyle]} numberOfLines={1}>{this.props.name}</StyledText>
          <StyledText style={[settingsStyles.value, theme.settingsValue, styles.value]} numberOfLines={1}>
            {this.props.value}
          </StyledText>
          <Icon name='ios-arrow-forward' style={[styles.chevron, theme.settingsArrow]} />
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsLink.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  isLastItem: PropTypes.bool,
  labelStyle: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsLink);
