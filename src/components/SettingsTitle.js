import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    lineHeight: 17,
    textTransform: 'uppercase',
    marginBottom: 5.5,
    paddingRight: 15,
    paddingLeft: 15
  }
});

class SettingsTitle extends Component {
  render() {
    const { theme } = this.props;

    return (
      <StyledText style={[styles.title, theme.settingsTitle]}>
        {this.props.children}
      </StyledText>
    );
  }
}

SettingsTitle.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsTitle);
