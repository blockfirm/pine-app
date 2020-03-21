import React, { Component } from 'react';
import { getClient } from '../clients/lightning';
import Status from '../components/Status';

const UPDATE_INTERVAL = 1000;

const LABEL_NOT_CONNECTED = 'Not Connected';
const LABEL_CONNECTING = 'Connecting...';
const LABEL_WAITING = 'Waiting for Node...';
const LABEL_CONNECTED = 'Connected';

class LightningConnectionStatusContainer extends Component {
  state = {
    status: Status.STATUS_ERROR,
    label: LABEL_NOT_CONNECTED
  };

  componentDidMount() {
    this._updateStatus();

    this._updateInterval = setInterval(() => {
      this._updateStatus();
    }, UPDATE_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this._updateInterval);
  }

  _updateStatus() {
    const client = getClient();

    if (!client) {
      return this.setState({
        status: Status.STATUS_ERROR,
        label: LABEL_NOT_CONNECTED
      });
    }

    if (client.disconnected) {
      return this.setState({
        status: Status.STATUS_WARNING,
        label: LABEL_CONNECTING
      });
    }

    if (!client.ready) {
      return this.setState({
        status: Status.STATUS_WARNING,
        label: LABEL_WAITING
      });
    }

    this.setState({
      status: Status.STATUS_OK,
      label: LABEL_CONNECTED
    });
  }

  render() {
    const { status, label } = this.state;

    return (
      <Status status={status} label={label} />
    );
  }
}

export default LightningConnectionStatusContainer;
