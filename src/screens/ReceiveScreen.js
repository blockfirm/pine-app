import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getUnusedAddress } from '../actions/bitcoin/wallet';
import StyledText from '../components/StyledText';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
  }
});

@connect()
export default class ReceiveScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {}

  componentDidMount() {
    const dispatch = this.props.dispatch;

    dispatch(getUnusedAddress()).then((address) => {
      this.setState({ address });
    });
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <StyledText>{this.state.address}</StyledText>
      </BaseScreen>
    );
  }
}

ReceiveScreen.propTypes = {
  dispatch: PropTypes.func
};
