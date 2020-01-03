import React, { PureComponent } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import { get as getServerInfo } from '../clients/paymentServer/info';
import { withTheme } from '../contexts/theme';

const DEBOUNCE_DELAY = 1000;

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5
  }
});

class PineServerStatus extends PureComponent {
  state = {
    loading: true,
    ok: false
  };

  componentDidMount() {
    this._updateStatus();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hostname !== this.props.hostname) {
      this._updateStatus(DEBOUNCE_DELAY);
    }
  }

  _updateStatus(delay = 0) {
    const { hostname, bitcoinNetwork, onStatusUpdated } = this.props;
    let ok = false;

    this.setState({ loading: true });
    clearTimeout(this._updateStatusTimer);

    this._updateStatusTimer = setTimeout(() => {
      getServerInfo(hostname)
        .then((serverInfo) => {
          if (serverInfo) {
            ok = serverInfo.isOpenForRegistrations && serverInfo.network === bitcoinNetwork;
          } else {
            ok = false;
          }
        })
        .catch(() => {
          ok = false;
        })
        .then(() => {
          onStatusUpdated(ok);
          this.setState({ ok, loading: false });
        });
    }, delay);
  }

  render() {
    const { style, theme } = this.props;
    const { loading, ok } = this.state;
    const dotColor = ok ? theme.statusSuccessColor : theme.statusErrorColor;

    if (loading) {
      return (
        <View style={[styles.container, style]}>
          <ActivityIndicator color='gray' size='small' />
        </View>
      );
    }

    return (
      <View style={[styles.container, style]}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      </View>
    );
  }
}

PineServerStatus.propTypes = {
  hostname: PropTypes.string,
  bitcoinNetwork: PropTypes.string,
  style: PropTypes.any,
  onStatusUpdated: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(PineServerStatus);
