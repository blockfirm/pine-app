import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../styles/headerStyles';
import ConversationHeaderTitle from '../components/ConversationHeaderTitle';
import BackButton from '../components/BackButton';
import Avatar from '../components/Avatar';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  headerAvatar: {
    position: 'absolute',
    top: -6,
    right: 5,
    padding: 10 // The padding makes it easier to press.
  }
});

@connect()
export default class ConversationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { contact } = navigation.state.params;
    const avatarChecksum = contact.avatar ? contact.avatar.checksum : null;

    return {
      headerTitle: <ConversationHeaderTitle contact={contact} />,
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight: (
        <TouchableOpacity onPress={() => {}} style={styles.headerAvatar}>
          <Avatar
            pineAddress={contact.pineAddress}
            checksum={avatarChecksum}
            size={36}
          />
        </TouchableOpacity>
      )
    };
  };

  render() {
    const { params } = this.props.navigation.state;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>

      </BaseScreen>
    );
  }
}

ConversationScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
