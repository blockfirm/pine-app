import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 29,
    height: 27
  }
});

class AddContactIcon extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={this.props.theme.addContactIcon} style={styles.icon} />
      </View>
    );
  }
}

AddContactIcon.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(AddContactIcon);
