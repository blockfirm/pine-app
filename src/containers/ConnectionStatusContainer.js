import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getInfo as getServerInfo } from '../actions/network/server/getInfo';
import ConnectionStatus from '../components/ConnectionStatus';

const UPDATE_INTERVAL = 3000;

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    serverInfo: state.network.server.info
  };
};

class ConnectionStatusContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    settings: PropTypes.object
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

  componentDidUpdate(prevProps) {
    const { settings } = this.props;

    if (prevProps.settings.api.baseUrl !== settings.api.baseUrl) {
      this._updateServerStatus();
    }
  }

  componentWillUnmount() {
    clearInterval(this._updateInterval);
  }

  render() {
    return (
      <ConnectionStatus {...this.props} />
    );
  }
}

const ConnectionStatusConnector = connect(
  mapStateToProps
)(ConnectionStatusContainer);

export default ConnectionStatusConnector;
