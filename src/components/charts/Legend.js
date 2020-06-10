import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../../contexts/theme';
import StyledText from '../StyledText';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  color: {
    height: 7,
    width: 7,
    borderRadius: 4
  },
  label: {
    marginLeft: 6,
    fontSize: 12
  }
});

class Legend extends Component {
  render() {
    const { color, label, style, theme } = this.props;

    return (
      <View style={[styles.container, style]}>
        <View
          style={[styles.color, { backgroundColor: color }]}
        />
        <StyledText style={[styles.label, theme.text]}>
          {label}
        </StyledText>
      </View>
    );
  }
}

Legend.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(Legend);
