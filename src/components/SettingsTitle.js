import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
    textTransform: 'uppercase',
    marginBottom: 5.5,
    paddingRight: 10,
    paddingLeft: 15
  },
  labelWrapper: {
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 2,
    alignSelf: 'flex-start'
  },
  labelText: {
    fontSize: 11
  }
});

class SettingsTitle extends Component {
  _renderLabel() {
    const { theme, label } = this.props;

    if (!label) {
      return null;
    }

    return (
      <View style={[theme.settingsLabelWrapper, styles.labelWrapper]}>
        <StyledText style={[theme.settingsTitle, styles.labelText]}>
          {label}
        </StyledText>
      </View>
    );
  }

  render() {
    const { theme } = this.props;

    return (
      <View style={styles.container}>
        <StyledText style={[styles.title, theme.settingsTitle]}>
          {this.props.children}
        </StyledText>

        {this._renderLabel()}
      </View>
    );
  }
}

SettingsTitle.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsTitle);
