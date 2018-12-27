import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CurrencyLabelContainer from './CurrencyLabelContainer';

const mapStateToProps = (state) => {
  return {
    balance: state.bitcoin.wallet.balance
  };
};

class BalanceLabelContainer extends Component {
  static propTypes = {
    balance: PropTypes.number
  };

  render() {
    return (
      <CurrencyLabelContainer
        {...this.props}
        amountBtc={this.props.balance}
      />
    );
  }
}

const BalanceLabelConnector = connect(
  mapStateToProps
)(BalanceLabelContainer);

export default BalanceLabelConnector;
