import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Entypo';

import { withTheme } from '../../contexts/theme';
import StyledText from '../StyledText';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    fontSize: 17,
    marginTop: 3
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 0,
    marginLeft: 10
  }
});

class ChangeServerButton extends Component {
  render() {
    const { theme, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Icon name='cloud' style={[styles.icon, theme.link]} />
        <StyledText style={[styles.label, theme.link]}>
          Change Server
        </StyledText>
      </TouchableOpacity>
    );
  }
}

ChangeServerButton.propTypes = {
  theme: PropTypes.object.isRequired,
  onPress: PropTypes.func
};

export default withTheme(ChangeServerButton);
