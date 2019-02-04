import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { parse as parseAddress, resolveBaseUrl } from '../PinePaymentProtocol/address';

const AVATAR_PLACEHOLDER = require('../images/AvatarPlaceholder.png');
const DEFAULT_SIZE = 60;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 100,
    overflow: 'hidden'
  }
});

export default class Avatar extends Component {
  _getSizeStyle() {
    const size = this.props.size || DEFAULT_SIZE;

    return {
      width: size,
      height: size
    };
  }

  _getUrl() {
    const { pineAddress, checksum } = this.props;
    const { username, hostname } = parseAddress(pineAddress);
    const baseUrl = resolveBaseUrl(hostname);
    const url = `${baseUrl}/v1/users/${username}/avatar?byUsername=1&c=${checksum}`;

    return url;
  }

  _renderPlaceholder() {
    const sizeStyle = this._getSizeStyle();

    return (
      <View style={[styles.wrapper, sizeStyle]}>
        <Image source={AVATAR_PLACEHOLDER} style={sizeStyle} />
      </View>
    );
  }

  render() {
    const { pineAddress } = this.props;

    if (!pineAddress) {
      return this._renderPlaceholder();
    }

    const sizeStyle = this._getSizeStyle();
    const uri = this._getUrl();

    return (
      <View style={[styles.wrapper, sizeStyle]}>
        <Image source={{ uri }} style={sizeStyle} />
      </View>
    );
  }
}

Avatar.propTypes = {
  size: PropTypes.number,
  pineAddress: PropTypes.string,
  checksum: PropTypes.string
};
