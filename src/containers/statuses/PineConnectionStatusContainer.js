import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import parseAddress from '../../clients/paymentServer/address/parse';
import { get as getServerInfo } from '../../clients/paymentServer/info';
import Status from '../../components/Status';

const UPDATE_INTERVAL = 3000;

const LABEL_NOT_CONNECTED = 'Not Connected';
const LABEL_CONNECTED = 'Connected';
const LABEL_INCONSISTENT_NETWORKS = 'Inconsistent Networks';
const LABEL_SYNC_ERROR = 'Syncing Error';

const mapStateToProps = (state) => ({
  settings: state.settings,
  syncError: Boolean(state.network.pine.disconnected)
});

class PineConnectionStatusContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    settings: PropTypes.object,
    syncError: PropTypes.bool
  };

  state = {
    connected: null,
    serverBitcoinNetwork: null
  };

  async _updateServerStatus() {
    const { settings } = this.props;
    const { hostname } = parseAddress(settings.user.profile.address);
    let connected = false;
    let serverBitcoinNetwork = null;

    try {
      const serverInfo = await getServerInfo(hostname);

      if (serverInfo) {
        serverBitcoinNetwork = serverInfo.network;
        connected = true;
      }
    } catch (error) {
      connected = false;
    }

    this.setState({
      connected,
      serverBitcoinNetwork
    });
  }

  componentDidMount() {
    this._updateServerStatus();

    this._updateInterval = setInterval(() => {
      this._updateServerStatus();
    }, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._updateInterval);
  }

  render() {
    const { settings, syncError } = this.props;
    const { connected, serverBitcoinNetwork } = this.state;
    let status = Status.STATUS_ERROR;
    let label = LABEL_NOT_CONNECTED;

    if (connected) {
      if (serverBitcoinNetwork !== settings.bitcoin.network) {
        status = Status.STATUS_WARNING;
        label = LABEL_INCONSISTENT_NETWORKS;
      } else if (syncError) {
        status = Status.STATUS_ERROR;
        label = LABEL_SYNC_ERROR;
      } else {
        status = Status.STATUS_OK;
        label = LABEL_CONNECTED;
      }
    } else if (connected === null && !syncError) {
      status = Status.STATUS_OK;
      label = LABEL_CONNECTED;
    }

    return (
      <Status status={status} label={label} />
    );
  }
}

const PineConnectionStatusConnector = connect(
  mapStateToProps
)(PineConnectionStatusContainer);

export default PineConnectionStatusConnector;
