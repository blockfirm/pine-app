import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';

import { withTheme } from '../contexts/theme';
import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: 1,
    right: 15,
    height: 42
  },
  checkmark: {
    position: 'absolute',
    right: 15,
    fontSize: 16,
    paddingTop: 2
  }
});

class SettingsButton extends Component {
  _onPress() {
    if (!this.props.loading) {
      this.props.onPress();
    }
  }

  render() {
    const { isLastItem, type, loading, showCheckmark, theme } = this.props;
    const title = loading ? this.props.loadingTitle : this.props.title;

    const containerStyles = [
      settingsStyles.item,
      theme.settingsItem,
      isLastItem ? { borderBottomWidth: 0 } : undefined,
      this.props.containerStyle
    ];

    const labelStyles = [
      settingsStyles.label,
      theme.settingsButtonPrimary,
      this.props.style,
      type === 'destructive' ? theme.destructiveLabel : undefined,
      loading ? theme.settingsButtonDisabled : undefined
    ];

    return (
      <TouchableHighlight onPress={this._onPress.bind(this)} underlayColor={theme.settingsUnderlayColor}>
        <View style={containerStyles}>
          <StyledText style={labelStyles}>{title}</StyledText>
          { loading ? <ActivityIndicator color='gray' style={[styles.loader, this.props.loaderStyle]} size='small' /> : null }
          { showCheckmark ? <Icon name='check' style={[styles.checkmark, theme.settingsGreenCheckmark]} /> : null }
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsButton.propTypes = {
  style: PropTypes.any,
  containerStyle: PropTypes.any,
  loaderStyle: PropTypes.any,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['destructive']),
  isLastItem: PropTypes.bool,
  loading: PropTypes.bool,
  loadingTitle: PropTypes.string,
  showCheckmark: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsButton);
