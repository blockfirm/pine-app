import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  lowercase: {
    textTransform: 'lowercase'
  }
});

const LowercaseText = (props) => (
  <Text style={styles.lowercase}>
    {props.children}
  </Text>
);

LowercaseText.propTypes = {
  children: PropTypes.node
};

export default LowercaseText;
