import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import CopyText from './CopyText';

const STUB_LENGTH = 8;

export default class AddressLabel extends Component {
  _getShortenedAddress() {
    const { address } = this.props;

    if (!address) {
      return '';
    }

    const start = address.slice(0, STUB_LENGTH);
    const end = address.slice(-STUB_LENGTH);

    return `${start}...${end}`;
  }

  render() {
    const { address } = this.props;
    const shortenedAddress = this._getShortenedAddress();

    return (
      <View style={this.props.style}>
        <CopyText copyText={address} tooltipArrowDirection={this.props.tooltipArrowDirection}>
          <Text style={this.props.textStyle}>
            {shortenedAddress}
          </Text>
        </CopyText>
      </View>
    );
  }
}

AddressLabel.propTypes = {
  style: PropTypes.any,
  textStyle: PropTypes.any,
  tooltipArrowDirection: PropTypes.string,
  address: PropTypes.string
};
