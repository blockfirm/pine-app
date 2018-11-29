import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const STUB_LENGTH = 8;

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Menlo'
  }
});

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
    const shortenedAddress = this._getShortenedAddress();

    return (
      <Text style={[styles.label, this.props.style]}>
        {shortenedAddress}
      </Text>
    );
  }
}

AddressLabel.propTypes = {
  style: PropTypes.any,
  address: PropTypes.string
};
