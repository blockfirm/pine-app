import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  description: {
    fontSize: 13,
    lineHeight: 17,
    marginTop: -25,
    marginBottom: 30,
    paddingRight: 15,
    paddingLeft: 15
  }
});

class SettingsDescription extends Component {
  render() {
    const { theme } = this.props;

    return (
      <StyledText style={[styles.description, theme.settingsDescription]}>
        {this.props.children}
      </StyledText>
    );
  }
}

SettingsDescription.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsDescription);
