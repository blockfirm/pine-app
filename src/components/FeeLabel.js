import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { formatPercentage } from '../localization';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import Bullet from './typography/Bullet';
import StyledText from './StyledText';

const FEE_HIGH_COLOR = '#FF3B30';
const FEE_MEDIUM_COLOR = '#FF9500';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default class FeeLabel extends Component {
  _getPercentage() {
    const { amount, fee } = this.props;
    return fee / Math.abs(amount) * 100;
  }

  _getPercentageColor() {
    const percentage = this._getPercentage();

    if (percentage > 20) {
      return FEE_HIGH_COLOR;
    }

    if (percentage > 5) {
      return FEE_MEDIUM_COLOR;
    }
  }

  _renderFeePercentage() {
    const percentage = this._getPercentage();
    return formatPercentage(percentage);
  }

  render() {
    const { fee, currency, unit, style } = this.props;
    const percentage = this._renderFeePercentage();
    const percentageColor = this._getPercentageColor();

    const percentageStyles = [
      this.props.style,
      percentageColor ? { color: percentageColor } : null
    ];

    return (
      <View style={[styles.wrapper, this.props.style]}>
        <CurrencyLabelContainer
          amountBtc={fee}
          currency={currency}
          unit={unit}
          style={style}
        />
        <Bullet />
        <StyledText style={percentageStyles}>{percentage}</StyledText>
      </View>
    );
  }
}

FeeLabel.propTypes = {
  style: PropTypes.any,
  amount: PropTypes.number,
  fee: PropTypes.number,
  currency: PropTypes.string,
  unit: PropTypes.string
};
