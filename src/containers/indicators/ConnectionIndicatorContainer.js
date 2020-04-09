/* eslint-disable operator-linebreak */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getClient as getLightningClient } from '../../clients/lightning';
import WarningDotIndicator from '../../components/indicators/WarningDotIndicator';

const LIGHTNING_UPDATE_INTERVAL = 2000;

const mapStateToProps = (state) => ({
  isDisconnectedFromInternet: Boolean(state.network.internet.disconnected),
  isDisconnectedFromServer: Boolean(state.network.server.disconnected),
  isDisconnectedFromPineServer: Boolean(state.network.pine.disconnected),
  isDisconnectedFromLightningServer: Boolean(state.network.lightning.disconnected)
});

class ConnectionIndicatorContainer extends PureComponent {
  static CONNECTION_TYPE_BITCOIN = 'bitcoin';
  static CONNECTION_TYPE_LIGHTNING = 'lightning';
  static CONNECTION_TYPE_PINE = 'pine';
  static CONNECTION_TYPE_ALL = 'all';

  static propTypes = {
    isDisconnectedFromInternet: PropTypes.bool,
    isDisconnectedFromServer: PropTypes.bool,
    isDisconnectedFromPineServer: PropTypes.bool,
    isDisconnectedFromLightningServer: PropTypes.bool,
    connectionType: PropTypes.oneOf([
      ConnectionIndicatorContainer.CONNECTION_TYPE_BITCOIN,
      ConnectionIndicatorContainer.CONNECTION_TYPE_LIGHTNING,
      ConnectionIndicatorContainer.CONNECTION_TYPE_PINE,
      ConnectionIndicatorContainer.CONNECTION_TYPE_ALL
    ])
  };

  static defaultPropTypes = {
    connectionType: ConnectionIndicatorContainer.CONNECTION_TYPE_ALL
  };

  state = {
    lightningStatus: true
  };

  componentDidMount() {
    this._updateLightningStatus();

    this._updateLightningInterval = setInterval(() => {
      this._updateLightningStatus();
    }, LIGHTNING_UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._updateLightningInterval);
  }

  _updateLightningStatus() {
    const lightningClient = getLightningClient();

    if (!lightningClient) {
      return;
    }

    const lightningStatus = (
      lightningClient.ready &&
      !lightningClient.disconnected &&
      !this.props.isDisconnectedFromLightningServer
    );

    this.setState({ lightningStatus });
  }

  _getBitcoinConnectionStatus() {
    return !this.props.isDisconnectedFromServer;
  }

  _getLightningConnectionStatus() {
    return this.state.lightningStatus;
  }

  _getPineConnectionStatus() {
    return !this.props.isDisconnectedFromPineServer;
  }

  _shouldShow() {
    const { connectionType, isDisconnectedFromInternet } = this.props;

    // The OfflineNotice will show instead if no internet connection.
    if (isDisconnectedFromInternet) {
      return false;
    }

    switch (connectionType) {
      case ConnectionIndicatorContainer.CONNECTION_TYPE_BITCOIN:
        return !this._getBitcoinConnectionStatus();

      case ConnectionIndicatorContainer.CONNECTION_TYPE_LIGHTNING:
        return !this._getLightningConnectionStatus();

      case ConnectionIndicatorContainer.CONNECTION_TYPE_PINE:
        return !this._getPineConnectionStatus();

      default:
        return (
          !this._getBitcoinConnectionStatus() ||
          !this._getLightningConnectionStatus() ||
          !this._getPineConnectionStatus()
        );
    }
  }

  render() {
    if (!this._shouldShow()) {
      return null;
    }

    return (
      <WarningDotIndicator {...this.props} />
    );
  }
}

const ConnectionIndicatorConnector = connect(
  mapStateToProps
)(ConnectionIndicatorContainer);

export default ConnectionIndicatorConnector;
