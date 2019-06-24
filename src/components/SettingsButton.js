import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';

import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  label: {
    color: '#007AFF'
  },
  destructive: {
    color: '#FF3B30'
  },
  disabled: {
    color: '#8A8A8F'
  },
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
    color: '#4CD964',
    paddingTop: 2
  }
});

export default class SettingsButton extends Component {
  _onPress() {
    if (!this.props.loading) {
      this.props.onPress();
    }
  }

  render() {
    const { isLastItem, type, loading, showCheckmark } = this.props;
    const title = loading ? this.props.loadingTitle : this.props.title;
    const underlayColor = loading ? 'white' : settingsStyles.underlayColor;

    const containerStyles = [
      settingsStyles.item,
      isLastItem ? { borderBottomWidth: 0 } : undefined,
      this.props.containerStyle
    ];

    const labelStyles = [
      settingsStyles.label,
      styles.label,
      this.props.style,
      type === 'destructive' ? styles.destructive : undefined,
      loading ? styles.disabled : undefined
    ];

    return (
      <TouchableHighlight onPress={this._onPress.bind(this)} underlayColor={underlayColor}>
        <View style={containerStyles}>
          <StyledText style={labelStyles}>{title}</StyledText>
          { loading ? <ActivityIndicator color='gray' style={[styles.loader, this.props.loaderStyle]} size='small' /> : null }
          { showCheckmark ? <Icon name='check' style={styles.checkmark} /> : null }
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
  showCheckmark: PropTypes.bool
};
