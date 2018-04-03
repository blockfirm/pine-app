import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
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
    fontWeight: '400',
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
  }
});

export default class SettingsButton extends Component {
  _onPress() {
    if (!this.props.loading) {
      this.props.onPress();
    }
  }

  render() {
    const { isLastItem, type, loading } = this.props;
    const title = loading ? this.props.loadingTitle : this.props.title;
    const underlayColor = loading ? 'white' : '#FAFAFA';

    const containerStyles = [
      styles.container,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    const labelStyles = [
      styles.label,
      type === 'destructive' ? styles.destructive : undefined,
      loading ? styles.disabled : undefined
    ];

    return (
      <TouchableHighlight onPress={this._onPress.bind(this)} underlayColor={underlayColor}>
        <View style={containerStyles}>
          <StyledText style={labelStyles}>{title}</StyledText>
          { loading ? <ActivityIndicator animating={true} color='#8A8A8F' style={styles.loader} size='small' /> : null }
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  isLastItem: PropTypes.bool,
  loading: PropTypes.bool,
  loadingTitle: PropTypes.string
};
