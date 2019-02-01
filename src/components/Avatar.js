import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

const AVATAR_PLACEHOLDER = require('../images/AvatarPlaceholder.png');
const DEFAULT_SIZE = 60;

export default class Avatar extends Component {
  render() {
    const size = this.props.size || DEFAULT_SIZE;

    const style = {
      width: size,
      height: size
    };

    return (
      <Image source={AVATAR_PLACEHOLDER} style={style} />
    );
  }
}

Avatar.propTypes = {
  size: PropTypes.number
};
