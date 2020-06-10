import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 19,
    height: 17
  }
});

class AddCardIcon extends Component {
  render() {
    const { theme, style, active } = this.props;
    const source = active ? theme.addCardActiveIcon : theme.addCardIcon;

    return (
      <View style={style}>
        <Image source={source} style={styles.icon} />
      </View>
    );
  }
}

AddCardIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  style: PropTypes.any,
  active: PropTypes.bool
};

AddCardIcon.defaultProps = {
  active: false
};

export default withTheme(AddCardIcon);
