import React, { Component } from 'react';
import { StyleSheet, Share, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ShareIcon from '../../components/icons/ShareIcon';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsTitle from '../../components/SettingsTitle';
import StyledText from '../../components/StyledText';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  share: {
    position: 'absolute',
    top: 0,
    right: 11.5,
    padding: 9 // The padding makes it easier to press.
  },
  details: {
    margin: 15,
    fontFamily: 'Menlo'
  }
});

@connect()
export default class LogDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const onShare = navigation.getParam('onShare');

    return {
      headerTransparent: true,
      headerBackground: <SettingsHeaderBackground />,
      headerTitle: <HeaderTitle title='Log Entry' />,
      headerLeft: <BackButton onPress={() => navigation.goBack()} />,
      headerRight: (
        <TouchableOpacity onPress={onShare} style={styles.share}>
          <ShareIcon />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onShare: this._onShare.bind(this)
    });
  }

  _onShare() {
    const entry = this.props.navigation.getParam('entry');

    Share.share({
      type: 'plain/text',
      subject: 'Pine Log Details',
      message: JSON.stringify(entry, null, 2)
    });
  }

  render() {
    const entry = this.props.navigation.getParam('entry');

    return (
      <BaseSettingsScreen>
        <SettingsTitle>Details</SettingsTitle>
        <SettingsGroup>
          <StyledText style={styles.details}>
            {JSON.stringify(entry, null, 2)}
          </StyledText>
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

LogDetailsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
