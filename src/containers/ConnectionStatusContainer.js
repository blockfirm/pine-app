import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getInfo as getServerInfo } from '../actions/network/server/getInfo';
import Status from '../components/Status';

const UPDATE_INTERVAL = 3000;

const LABEL_NOT_CONNECTED = 'Not Connected';
const LABEL_CONNECTED = 'Connected';
const LABEL_INCONSISTENT_NETWORKS = 'Inconsistent Networks';
const LABEL_SERVER_NOT_CONNECTED_TO_NODE = 'Server Not Connected to Node';

const mapStateToProps = (state) => ({
  settings: state.settings,
  serverInfo: state.network.server.info
});

class ConnectionStatusContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    settings: PropTypes.object,
    serverInfo: PropTypes.object
  };

  _updateServerStatus() {
    const { dispatch } = this.props;

    dispatch(getServerInfo()).catch(() => {
      // Suppress server errors (will be handled by the reducer).
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

  componentDidUpdate(prevProps) {
    const { settings } = this.props;

    if (prevProps.settings.api.baseUrl !== settings.api.baseUrl) {
      this._updateServerStatus();
    }
  }

  render() {
    const { settings, serverInfo } = this.props;
    let status = Status.STATUS_ERROR;
    let label = LABEL_NOT_CONNECTED;

    if (serverInfo) {
      if (serverInfo.isConnected) {
        if (serverInfo.network === settings.bitcoin.network) {
          status = Status.STATUS_OK;
          label = LABEL_CONNECTED;
        } else {
          status = Status.STATUS_WARNING;
          label = LABEL_INCONSISTENT_NETWORKS;
        }
      } else if (serverInfo.isConnected === false) {
        label = LABEL_SERVER_NOT_CONNECTED_TO_NODE;
      }
    }

    return (
      <Status status={status} label={label} />
    );
  }
}

const ConnectionStatusConnector = connect(
  mapStateToProps
)(ConnectionStatusContainer);

export default ConnectionStatusConnector;
