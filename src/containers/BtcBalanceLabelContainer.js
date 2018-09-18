import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BtcLabelContainer from './BtcLabelContainer';

const mapStateToProps = (state) => {
  return {
    balance: state.bitcoin.wallet.balance
  };
};

class BtcBalanceLabelContainer extends Component {
  static propTypes = {
    balance: PropTypes.number
  };

  render() {
    return (
      <BtcLabelContainer
        {...this.props}
        amount={this.props.balance}
      />
    );
  }
}

const BtcBalanceLabelConnector = connect(
  mapStateToProps
)(BtcBalanceLabelContainer);

export default BtcBalanceLabelConnector;
