import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from '../components/StyledText';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 12
  },
  label: {
    fontSize: 15,
    fontWeight: '600'
  }
});

class Status extends Component {
  static STATUS_ERROR = 'error';
  static STATUS_WARNING = 'warning';
  static STATUS_OK = 'ok';

  _getStatusColor() {
    const { status, theme } = this.props;

    const colorMap = {
      [Status.STATUS_ERROR]: theme.statusErrorColor,
      [Status.STATUS_WARNING]: theme.statusWarningColor,
      [Status.STATUS_OK]: theme.statusSuccessColor
    };

    return colorMap[status] || theme.statusErrorColor;
  }

  render() {
    const { label } = this.props;
    const statusColor = this._getStatusColor();

    return (
      <View style={styles.wrapper}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <StyledText style={styles.label}>{label}</StyledText>
      </View>
    );
  }
}

Status.propTypes = {
  theme: PropTypes.object.isRequired,
  status: PropTypes.oneOf([
    Status.STATUS_ERROR,
    Status.STATUS_WARNING,
    Status.STATUS_OK
  ]).isRequired,
  label: PropTypes.string.isRequired
};

export default withTheme(Status);
