import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';

import { sync } from '../actions';
import { reset as navigateWithReset } from '../actions/navigate';
import { handle as handleError } from '../actions/error';
import { save as saveSettings } from '../actions/settings';
import { openInboundChannel } from '../actions/lightning';
import { getClient } from '../clients/lightning';
import Paragraph from '../components/Paragraph';
import ProgressBar from '../components/ProgressBar';
import BaseScreen from './BaseScreen';

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
    textAlign: 'center',
    fontSize: 13
  }
});

@connect(state => ({
  rpcMetrics: state.lightning.metrics
}))
export default class ActivatingLightningScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    deriveNextKeyCallsStart: 0,
    getRevocationRootKeyCallsStart: 0,
    signOutputRawCallsStart: 0,
    channelOpened: false,
    synced: false
  };

  componentDidMount() {
    const { rpcMetrics } = this.props;

    this.setState({
      deriveNextKeyCallsStart: rpcMetrics.DERIVE_NEXT_KEY || 0,
      getRevocationRootKeyCallsStart: rpcMetrics.GET_REVOCATION_ROOT_KEY || 0,
      signOutputRawCallsStart: rpcMetrics.SIGN_OUTPUT_RAW || 0
    });

    this._openInboundChannelWhenReady();

    KeepAwake.activate();
  }

  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  _openInboundChannelWhenReady() {
    const client = getClient();

    if (client.ready) {
      return this._openInboundChannel();
    }

    setTimeout(this._openInboundChannelWhenReady.bind(this), 1000);
  }

  _showLightningSetupComplete() {
    const { dispatch } = this.props;

    dispatch(saveSettings({
      lightning: { isSetup: true }
    }));

    dispatch(navigateWithReset('LightningSetupComplete'));
  }
  
  async _openInboundChannel() {
    const { dispatch, navigation } = this.props;

    try {
      await dispatch(openInboundChannel());
      this.setState({ channelOpened: true });

      await dispatch(sync({ force: true }));
      this.setState({ synced: true });

      // Give the progress bar some time to animate.
      setTimeout(() => {
        this._showLightningSetupComplete();
      }, PROGRESS_BAR_ANIMATION_DURATION);
    } catch (error) {
      dispatch(handleError(error));
    }
  }

  _getProgress() {
    const { rpcMetrics } = this.props;

    const {
      deriveNextKeyCallsStart,
      getRevocationRootKeyCallsStart,
      signOutputRawCallsStart,
      channelOpened,
      synced
    } = this.state;

    const deriveNextKeyCalls = Math.max((rpcMetrics.DERIVE_NEXT_KEY || 0) - deriveNextKeyCallsStart, 0);
    const getRevocationRootKeyCalls = Math.max((rpcMetrics.GET_REVOCATION_ROOT_KEY || 0) - getRevocationRootKeyCallsStart, 0);
    const signOutputRawCalls = Math.max((rpcMetrics.SIGN_OUTPUT_RAW || 0) - signOutputRawCallsStart, 0);

    if (deriveNextKeyCalls < 5) {
      return 0.05 + deriveNextKeyCalls * 0.1;
    }

    if (!getRevocationRootKeyCalls) {
      return 0.6;
    }

    if (!signOutputRawCalls) {
      return 0.7;
    }

    if (!channelOpened) {
      return 0.8;
    }

    if (!synced) {
      return 0.9;
    }

    return 1;
  }

  render() {
    const progress = this._getProgress();

    return (
      <BaseScreen
        style={styles.view}
        hideHeader={true}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
      >
        <ActivityIndicator color='gray' size='small' />

        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          animationDuration={PROGRESS_BAR_ANIMATION_DURATION}
        />

        <Paragraph style={styles.paragraph}>
          Activating Lightning: Please keep this screen open until it's done.
        </Paragraph>
      </BaseScreen>
    );
  }
}

ActivatingLightningScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
