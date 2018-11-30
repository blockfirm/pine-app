import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  title: {
    color: '#8A8A8F',
    fontSize: 13,
    lineHeight: 17,
    textTransform: 'uppercase',
    marginBottom: 5.5,
    paddingRight: 15,
    paddingLeft: 15
  }
});

export default class SettingsTitle extends Component {
  render() {
    return (
      <StyledText style={styles.title}>
        {this.props.children}
      </StyledText>
    );
  }
}

SettingsTitle.propTypes = {
  children: PropTypes.node
};
