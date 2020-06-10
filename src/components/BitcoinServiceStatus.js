import React, { PureComponent } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import * as api from '../clients/api';
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

class BitcoinServiceStatus extends PureComponent {
  state = {
    loading: true,
    ok: false
  };

  componentDidMount() {
    this._updateStatus();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.serviceUrl !== this.props.serviceUrl) {
      this._updateStatus(DEBOUNCE_DELAY);
    }
  }

  _updateStatus(delay = 0) {
    const { serviceUrl, bitcoinNetwork, onStatusUpdated } = this.props;
    let ok = false;

    this.setState({ loading: true });
    clearTimeout(this._updateStatusTimer);

    if (!serviceUrl) {
      onStatusUpdated(ok);
      return this.setState({ ok, loading: false });
    }

    this._updateStatusTimer = setTimeout(() => {
      api.info.get({ baseUrl: serviceUrl })
        .then((serverInfo) => {
          if (serverInfo) {
            ok = serverInfo.network === bitcoinNetwork;
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

BitcoinServiceStatus.propTypes = {
  serviceUrl: PropTypes.string,
  bitcoinNetwork: PropTypes.string,
  style: PropTypes.any,
  onStatusUpdated: PropTypes.func,
  theme: PropTypes.object.isRequired
};

BitcoinServiceStatus.defaultProps = {
  onStatusUpdated: () => {}
};

export default withTheme(BitcoinServiceStatus);
