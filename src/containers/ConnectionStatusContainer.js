import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getInfo as getServerInfo } from '../actions/network/server/getInfo';
import ConnectionStatus from '../components/ConnectionStatus';

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

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(getServerInfo()).catch(() => {
      // Suppress server errors (will be handled by the reducer).
    });
  }

  componentDidUpdate(prevProps) {
    const { dispatch, settings } = this.props;

    if (prevProps.settings.api.baseUrl !== settings.api.baseUrl) {
      dispatch(getServerInfo()).catch(() => {
        // Suppress server errors (will be handled by the reducer).
      });
    }
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
