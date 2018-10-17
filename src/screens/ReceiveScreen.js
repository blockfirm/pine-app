import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StyledText from '../components/StyledText';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
  }
});

@connect((state) => ({
  address: state.bitcoin.wallet.addresses.external.unused
}))
export default class ReceiveScreen extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <StyledText>{this.props.address}</StyledText>
      </BaseScreen>
    );
  }
}

ReceiveScreen.propTypes = {
  dispatch: PropTypes.func,
  address: PropTypes.string
};
