import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';
import { beginBackgroundTask, endBackgroundTask } from 'react-native-begin-background-task';

import { sync } from '../../actions';
import { handle as handleError } from '../../actions/error';
import { closeChannel } from '../../actions/lightning';
import Paragraph from '../../components/Paragraph';
import ProgressBar from '../../components/ProgressBar';
import BaseScreen from '../BaseScreen';

const PROGRESS_BAR_ANIMATION_DURATION = 1000;

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
    textAlign: 'center'
  }
});

@connect(state => ({
  rpcMetrics: state.lightning.metrics
}))
export default class CloseChannelScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    newAddressCallsStart: 0,
    signOutputRawCallsStart: 0,
    channelClosed: false,
    synced: false
  };

  componentDidMount() {
    const { rpcMetrics } = this.props;

    this.setState({
      newAddressCallsStart: rpcMetrics.NEW_ADDRESS || 0,
      signOutputRawCallsStart: rpcMetrics.SIGN_OUTPUT_RAW || 0
    });

    KeepAwake.activate();

    beginBackgroundTask().then(backgroundTaskId => {
      this._backgroundTaskId = backgroundTaskId;
      this._closeChannel();
    });
  }

  componentWillUnmount() {
    if (this._backgroundTaskId) {
      endBackgroundTask(this._backgroundTaskId);
    }

    KeepAwake.deactivate();
  }

  async _closeChannel() {
    const { dispatch, navigation } = this.props;

    try {
      await dispatch(closeChannel());
      this.setState({ channelClosed: true });

      await dispatch(sync({ force: true }));
      this.setState({ synced: true });
    } catch (error) {
      dispatch(handleError(error));
    }

    // Give the progress bar time to animate.
    setTimeout(() => {
      navigation.goBack();
    }, PROGRESS_BAR_ANIMATION_DURATION);
  }

  _getProgress() {
    const { rpcMetrics } = this.props;

    const {
      newAddressCallsStart,
      signOutputRawCallsStart,
      channelClosed,
      synced
    } = this.state;

    const newAddressCalls = Math.max((rpcMetrics.NEW_ADDRESS || 0) - newAddressCallsStart, 0);
    const signOutputRawCalls = Math.max((rpcMetrics.SIGN_OUTPUT_RAW || 0) - signOutputRawCallsStart, 0);

    if (!newAddressCalls) {
      return 0.05;
    }

    if (!signOutputRawCalls) {
      return 0.5;
    }

    if (!channelClosed) {
      return 0.75;
    }

    if (!synced) {
      return 0.85;
    }

    return 1;
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

        <ProgressBar
          style={styles.progressBar}
          progress={progress}
          destructive={true}
          animationDuration={PROGRESS_BAR_ANIMATION_DURATION}
        />

        <Paragraph style={styles.paragraph}>
          Closing channel. This may take a few seconds, please keep this screen active until it's done.
        </Paragraph>
      </BaseScreen>
    );
  }
}

CloseChannelScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
