import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import OfflineNotice from '../components/OfflineNotice';

const mapStateToProps = (state) => {
  return {
    isDisconnectedFromServer: state.network.disconnected
  };
};

class OfflineNoticeContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  state = {
    isDisconnectedFromInternet: false
  };

  componentDidMount() {
    // Get initial internet connection status.
    NetInfo.isConnected.fetch().then(this._onConnectionChange.bind(this));

    // Listen for internet connection changes.
    NetInfo.isConnected.addEventListener('connectionChange', this._onConnectionChange.bind(this));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._onConnectionChange);
  }

  _onConnectionChange(isConnected) {
    this.setState({
      isDisconnectedFromInternet: !isConnected
    });
  }

  render() {
    const isDisconnectedFromInternet = this.state.isDisconnectedFromInternet;

    return (
      <OfflineNotice
        {...this.props}
        isDisconnectedFromInternet={isDisconnectedFromInternet}
      />
    );
  }
}

const OfflineNoticeConnector = connect(
  mapStateToProps
)(OfflineNoticeContainer);

export default OfflineNoticeConnector;
