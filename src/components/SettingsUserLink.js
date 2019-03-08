import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    borderBottomWidth: 0,
    justifyContent: 'center',
    marginVertical: 10,
    paddingLeft: 75,
    paddingRight: 30
  },
  avatarWrapper: {
    position: 'absolute'
  },
  displayName: {
    fontSize: 22,
    marginBottom: 5
  },
  address: {
    fontSize: 13
  },
  chevron: {
    position: 'absolute',
    right: 15,
    fontSize: 20,
    color: '#C7C7CC',
    paddingTop: 2
  }
});

export default class SettingsUserLink extends Component {
  render() {
    const { address, displayName, avatar } = this.props.user;
    const avatarChecksum = avatar ? avatar.checksum : null;

    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor={settingsStyles.underlayColor}>
        <View style={[settingsStyles.item, styles.wrapper]}>
          <View style={styles.avatarWrapper}>
            <Avatar pineAddress={address} checksum={avatarChecksum} />
          </View>
          <View>
            <StyledText style={styles.displayName} numberOfLines={1}>{displayName}</StyledText>
            <StyledText style={styles.address} numberOfLines={1}>{address}</StyledText>
          </View>
          <Icon name='ios-arrow-forward' style={styles.chevron} />
        </View>
      </TouchableHighlight>
    );
  }
}

SettingsUserLink.propTypes = {
  user: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};
