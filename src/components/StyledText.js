import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
    fontWeight: '400'
  }
});

class StyledText extends Component {
  render() {
    const { style, theme } = this.props;

    return (
      <Text style={[styles.text, theme.text, style]} numberOfLines={this.props.numberOfLines}>
        {this.props.children}
      </Text>
    );
  }
}

StyledText.propTypes = {
  style: PropTypes.any,
  numberOfLines: PropTypes.number,
  children: PropTypes.node,
  theme: PropTypes.object
};

export default withTheme(StyledText);
