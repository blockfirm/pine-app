import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderButton from './buttons/HeaderButton';

export default class DoneButton extends Component {
  render() {
    return (
      <HeaderButton label='Done' onPress={this.props.onPress} />
    );
  }
}

DoneButton.propTypes = {
  onPress: PropTypes.func
};
