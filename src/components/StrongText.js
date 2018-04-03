import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  strong: {
    fontWeight: '600'
  }
});

export default class StrongText extends Component {
  render() {
    return (
      <Text style={styles.strong}>
        {this.props.children}
      </Text>
    );
  }
}

StrongText.propTypes = {
  children: PropTypes.node
};
