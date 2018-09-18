import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BtcLabel from '../components/BtcLabel';

const mapStateToProps = (state) => {
  return {
    unit: state.settings.bitcoin.unit
  };
};

class BtcLabelContainer extends Component {
  static propTypes = {
    unit: PropTypes.string
  };

  render() {
    return (
      <BtcLabel
        {...this.props}
        unit={this.props.unit}
      />
    );
  }
}

const BtcLabelConnector = connect(
  mapStateToProps
)(BtcLabelContainer);

export default BtcLabelConnector;
