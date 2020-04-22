import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';

import { sync } from '../../actions';
import { handle as handleError } from '../../actions/error';
import { openChannel } from '../../actions/lightning';
import Paragraph from '../../components/Paragraph';
import ProgressBar from '../../components/ProgressBar';
import BaseScreen from '../BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressBar: {
    marginTop: 30,
    marginBottom: 20
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 13
  }
});

@connect(state => ({
  rpcMetrics: state.lightning.metrics
}))
export default class OpeningChannelScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    lockOutpointCallsStart: 0,
    computeInputScriptCallsStart: 0
  };

  componentDidMount() {
    const { rpcMetrics } = this.props;

    this.setState({
      lockOutpointCallsStart: rpcMetrics.LOCK_OUTPOINT || 0,
      computeInputScriptCallsStart: rpcMetrics.COMPUTE_INPUT_SCRIPT || 0
    });

    this._openChannel();
 
    KeepAwake.activate();
  }

  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  async _openChannel() {
    const { dispatch, navigation, screenProps } = this.props;
    const satsAmount = navigation.getParam('satsAmount');

    try {
      await dispatch(openChannel(satsAmount));
      await dispatch(sync({ force: true }));
      screenProps.dismiss();
    } catch (error) {
      dispatch(handleError(error));
      navigation.goBack();
    }
  }

  _getProgress() {
    const { rpcMetrics } = this.props;
    const { lockOutpointCallsStart, computeInputScriptCallsStart } = this.state;
    const lockOutpointCalls = Math.max((rpcMetrics.LOCK_OUTPOINT || 0) - lockOutpointCallsStart, 0);
    const computeInputScriptCalls = Math.max((rpcMetrics.COMPUTE_INPUT_SCRIPT || 0) - computeInputScriptCallsStart, 0);

    if (!lockOutpointCalls) {
      return 0.05;
    }

    return Math.max(computeInputScriptCalls / lockOutpointCalls, 0.05);
  }

  render() {
    const progress = this._getProgress();

    return (
      <BaseScreen
        style={styles.view}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
      >
        <ActivityIndicator color='gray' size='small' />
        <ProgressBar progress={progress} style={styles.progressBar} />
        <Paragraph style={styles.paragraph}>
          Opening Channel: This can take a while, please keep this screen active until it's done.
        </Paragraph>
      </BaseScreen>
    );
  }
}

OpeningChannelScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  screenProps: PropTypes.object
};
