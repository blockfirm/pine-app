import React, { Component } from 'react';
import { Image } from 'react-native';

export class CachedImage extends Component {
  render() {
    return (
      <Image {...this.props} />
    );
  }
}
