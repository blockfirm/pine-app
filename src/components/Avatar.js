import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import vendors from '../vendors';
import { parse as parseAddress, resolveBaseUrl } from '../clients/paymentServer/address';

const AVATAR_PLACEHOLDER = require('../images/AvatarPlaceholder.png');
const DEFAULT_SIZE = 60;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#F6F6F6'
  }
});

export default class Avatar extends Component {
  state = {
    error: false
  }

  static getDerivedStateFromProps(props, state) {
    let { error } = state;

    if (props.checksum !== state.checksum) {
      error = false;
    }

    return {
      checksum: props.checksum,
      error
    };
  }

  constructor() {
    super(...arguments);
    this._onError = this._onError.bind(this);
  }

  _onError() {
    this.setState({ error: true });
  }

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
    const { style } = this.props;
    const sizeStyle = this._getSizeStyle();

    return (
      <View style={[styles.wrapper, style, sizeStyle]}>
        <Image source={AVATAR_PLACEHOLDER} style={sizeStyle} />
      </View>
    );
  }

  _renderVendor() {
    const { vendorId, style } = this.props;
    const vendor = vendors.get(vendorId);
    const sizeStyle = this._getSizeStyle();

    if (!vendor.logo) {
      return this._renderPlaceholder();
    }

    return (
      <View style={[styles.wrapper, style, sizeStyle]}>
        <Image source={vendor.logo} style={sizeStyle} />
      </View>
    );
  }

  render() {
    const { error } = this.state;
    const { pineAddress, checksum, vendorId, style } = this.props;

    if (vendorId) {
      return this._renderVendor();
    }

    if (!pineAddress || !checksum || error) {
      return this._renderPlaceholder();
    }

    const sizeStyle = this._getSizeStyle();
    const uri = this._getUrl();

    return (
      <View style={[styles.wrapper, sizeStyle, style]}>
        <FastImage
          source={{ uri }}
          style={sizeStyle}
          onError={this._onError}
        />
      </View>
    );
  }
}

Avatar.propTypes = {
  size: PropTypes.number,
  pineAddress: PropTypes.string,
  checksum: PropTypes.string,
  vendorId: PropTypes.string,
  style: PropTypes.any
};
