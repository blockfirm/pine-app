import React, { Component } from 'react';
import { Image } from 'react-native';

export default class FastImage extends Component {
  render() {
    return (
      <Image {...this.props} />
    );
  }
}
