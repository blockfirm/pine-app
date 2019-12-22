import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  title: {
    fontSize: windowDimensions.width < 330 ? 16 : 18,
    fontWeight: '600',
    letterSpacing: 0.36,
    marginBottom: windowDimensions.width < 330 ? 7 : 10,
    textAlign: 'center'
  }
});

class Title extends Component {
  render() {
    const { theme } = this.props;

    return (
      <StyledText style={[styles.title, theme.title, this.props.style]}>
        {this.props.children}
      </StyledText>
    );
  }
}

Title.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node,
  theme: PropTypes.object
};

export default withTheme(Title);
