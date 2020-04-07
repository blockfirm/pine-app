import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getClient } from '../clients/lightning';
import Status from '../components/Status';

const UPDATE_INTERVAL = 1000;

const LABEL_NOT_CONNECTED = 'Not Connected';
const LABEL_CONNECTING = 'Connecting...';
const LABEL_WAITING = 'Waiting for Node...';
const LABEL_CONNECTED = 'Connected';
const LABEL_SYNC_ERROR = 'Syncing Error';

const mapStateToProps = (state) => ({
  syncError: state.lightning.syncError
});

class LightningConnectionStatusContainer extends Component {
  static propTypes = {
    syncError: PropTypes.object
  };

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
    const { syncError } = this.props;
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

    if (syncError) {
      return this.setState({
        status: Status.STATUS_ERROR,
        label: LABEL_SYNC_ERROR
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

const LightningConnectionStatusConnector = connect(
  mapStateToProps
)(LightningConnectionStatusContainer);

export default LightningConnectionStatusConnector;
