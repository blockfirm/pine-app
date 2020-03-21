import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Status from '../components/Status';

const LABEL_NOT_CONNECTED = 'Not Connected';
const LABEL_CONNECTED = 'Connected';
const LABEL_INCONSISTENT_NETWORKS = 'Inconsistent Networks';
const LABEL_SERVER_NOT_CONNECTED_TO_NODE = 'Server Not Connected to Node';

class ConnectionStatus extends Component {
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

ConnectionStatus.propTypes = {
  settings: PropTypes.object,
  serverInfo: PropTypes.object
};

export default ConnectionStatus;
