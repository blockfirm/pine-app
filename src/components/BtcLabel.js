import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';

export default class BtcLabel extends Component {
  render() {
    const { amount, unit } = this.props;
    let label;
    let unitLabel;

    switch (unit) {
      case UNIT_MBTC:
        label = amount / 1000;
        unitLabel = UNIT_MBTC;
        break;

      case UNIT_BTC:
      default:
        label = amount;
        unitLabel = UNIT_BTC;
    }

    return (
      <StyledText style={this.props.style}>
        {label} {unitLabel}
      </StyledText>
    );
  }
}

BtcLabel.propTypes = {
  style: PropTypes.any,
  amount: PropTypes.number.isRequired,
  unit: PropTypes.string
};
