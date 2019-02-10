import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from '../components/StyledText';

const COLOR_ERROR = '#FF3B30';
const COLOR_WARNING = '#FF8D36';
const COLOR_SUCCESS = '#4CD964';

const LABEL_NOT_CONNECTED = 'Not Connected';
const LABEL_CONNECTED = 'Connected';
const LABEL_INCONSISTENT_NETWORKS = 'Inconsistent Networks';
const LABEL_SERVER_NOT_CONNECTED_TO_NODE = 'Server Not Connected to Node';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 12
  },
  label: {
    fontSize: 15,
    fontWeight: '600'
  }
});

export default class ConnectionStatus extends Component {
  render() {
    const { settings, serverInfo } = this.props;
    let dotColor = COLOR_ERROR;
    let status = LABEL_NOT_CONNECTED;

    if (serverInfo) {
      if (serverInfo.isConnected) {
        if (serverInfo.network === settings.bitcoin.network) {
          dotColor = COLOR_SUCCESS;
          status = LABEL_CONNECTED;
        } else {
          dotColor = COLOR_WARNING;
          status = LABEL_INCONSISTENT_NETWORKS;
        }
      } else if (serverInfo.isConnected === false) {
        status = LABEL_SERVER_NOT_CONNECTED_TO_NODE;
      }
    }

    return (
      <View style={styles.wrapper}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <StyledText style={styles.label}>{status}</StyledText>
      </View>
    );
  }
}

ConnectionStatus.propTypes = {
  settings: PropTypes.object,
  serverInfo: PropTypes.object
};
