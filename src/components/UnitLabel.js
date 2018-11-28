import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';
const UNIT_SATOSHIS = 'Satoshis';

const UNIT_LABELS = {
  [UNIT_BTC]: UNIT_BTC,
  [UNIT_MBTC]: UNIT_MBTC,
  [UNIT_SATOSHIS]: UNIT_SATOSHIS.toLowerCase()
};

export default class UnitLabel extends Component {
  render() {
    const { unit } = this.props;
    const label = UNIT_LABELS[unit] || '❓';

    return (
      <StyledText style={this.props.style}>
        {label}
      </StyledText>
    );
  }
}

UnitLabel.propTypes = {
  style: PropTypes.any,
  unit: PropTypes.string
};
