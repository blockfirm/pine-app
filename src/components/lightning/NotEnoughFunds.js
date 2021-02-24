import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../../contexts/theme';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import StyledText from '../StyledText';

const styles = StyleSheet.create({
  notEnoughFundsText: {
    margin: 15,
    fontSize: 18,
    textAlign: 'center'
  }
});

const NotEnoughFunds = ({ minimumBtcAmount, theme }) => (
  <StyledText style={[theme.errorText, styles.notEnoughFundsText]}>
    You need a minimum of&nbsp;
    <CurrencyLabelContainer
      amountBtc={minimumBtcAmount}
      currencyType='primary'
      style={theme.errorText}
    />
    &nbsp;in spendable on-chain funds to open a Lightning channel.
  </StyledText>
);

NotEnoughFunds.propsTypes = {
  minimumBtcAmount: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(NotEnoughFunds);
