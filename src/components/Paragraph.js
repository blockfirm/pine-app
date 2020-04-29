import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20
  }
});

class Paragraph extends Component {
  render() {
    const { style, theme } = this.props;

    return (
      <StyledText style={[styles.paragraph, theme.paragraph, style]}>
        {this.props.children}
      </StyledText>
    );
  }
}

Paragraph.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node,
  theme: PropTypes.object
};

export default withTheme(Paragraph);
