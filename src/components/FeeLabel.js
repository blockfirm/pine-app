import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { formatPercentage } from '../localization';
import { withTheme } from '../contexts/theme';
import CurrencyLabelContainer from '../containers/CurrencyLabelContainer';
import Bullet from './typography/Bullet';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

class FeeLabel extends Component {
  _getPercentage() {
    const { amount, fee } = this.props;
    return fee / Math.abs(amount) * 100;
  }

  _getPercentageColor() {
    const { theme } = this.props;
    const percentage = this._getPercentage();

    if (percentage > 20) {
      return theme.feeLabelHighColor;
    }

    if (percentage > 5) {
      return theme.feeLabelMediumColor;
    }
  }

  _renderPrefix() {
    const { prefix, style } = this.props;

    if (!prefix) {
      return null;
    }

    return (
      <StyledText style={style}>{prefix}</StyledText>
    );
  }

  _renderFeePercentage() {
    const { style } = this.props;
    const percentage = this._getPercentage();
    const percentageColor = this._getPercentageColor();

    const percentageStyles = [
      style,
      percentageColor ? { color: percentageColor } : null
    ];

    return (
      <StyledText style={percentageStyles}>
        {formatPercentage(percentage)}
      </StyledText>
    );
  }

  render() {
    const { fee, currency, unit, style } = this.props;

    return (
      <View style={[styles.wrapper, style]}>
        {this._renderPrefix()}
        <CurrencyLabelContainer
          amountBtc={fee}
          currency={currency}
          unit={unit}
          style={style}
        />
        <Bullet />
        {this._renderFeePercentage()}
      </View>
    );
  }
}

FeeLabel.propTypes = {
  style: PropTypes.any,
  amount: PropTypes.number,
  fee: PropTypes.number,
  currency: PropTypes.string,
  unit: PropTypes.string,
  prefix: PropTypes.string,
  theme: PropTypes.object.isRequired
};

export default withTheme(FeeLabel);
