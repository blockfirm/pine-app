import React, { Component } from 'react';
import { View, Text, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import ToolTip from 'react-native-tooltip';

const STUB_LENGTH = 8;

export default class AddressLabel extends Component {
  constructor() {
    super(...arguments);
    this._onCopy = this._onCopy.bind(this);
  }

  _onCopy() {
    const { address } = this.props;
    Clipboard.setString(address);
  }

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
    const shortenedAddress = this._getShortenedAddress();

    return (
      <View style={this.props.style}>
        <ToolTip
          actions={[
            { text: 'Copy', onPress: this._onCopy }
          ]}
          underlayColor='white'
          activeOpacity={1}
        >
          <Text style={this.props.textStyle}>
            {shortenedAddress}
          </Text>
        </ToolTip>
      </View>
    );
  }
}

AddressLabel.propTypes = {
  style: PropTypes.any,
  textStyle: PropTypes.any,
  address: PropTypes.string
};
