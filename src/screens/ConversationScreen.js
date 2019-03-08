import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, ActionSheetIOS, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { handle as handleError } from '../actions/error/handle';
import { remove as removeContact } from '../actions/contacts/remove';
import headerStyles from '../styles/headerStyles';
import ContentView from '../components/ContentView';
import ConversationHeaderTitle from '../components/ConversationHeaderTitle';
import BackButton from '../components/BackButton';
import Avatar from '../components/Avatar';
import ContactRequestContainer from '../containers/ContactRequestContainer';
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
  scrollView: {
    alignSelf: 'stretch'
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerAvatar: {
    position: 'absolute',
    top: -6,
    right: 5,
    padding: 10 // The padding makes it easier to press.
  },
  headerLoader: {
    alignSelf: 'center',
    right: 23
  }
});

@connect()
export default class ConversationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { contact, showUserMenu, loading } = navigation.state.params;
    const avatarChecksum = contact.avatar ? contact.avatar.checksum : null;
    let headerRight;

    if (loading) {
      headerRight = (
        <ActivityIndicator animating={true} color='gray' size='small' style={styles.headerLoader} />
      );
    } else {
      headerRight = (
        <TouchableOpacity onPress={showUserMenu} style={styles.headerAvatar} disable={loading}>
          <Avatar
            pineAddress={contact.address}
            checksum={avatarChecksum}
            size={36}
          />
        </TouchableOpacity>
      );
    }

    return {
      headerTitle: <ConversationHeaderTitle contact={contact} />,
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight: contact.contactRequest ? null : headerRight
    };
  };

  constructor() {
    super(...arguments);

    this._onContactRequestAccept = this._onContactRequestAccept.bind(this);
    this._onContactRequestIgnore = this._onContactRequestIgnore.bind(this);
    this._onContactRequestDelete = this._onContactRequestDelete.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ showUserMenu: this._showUserMenu.bind(this) });
  }

  _showUserMenu() {
    const { dispatch, navigation } = this.props;
    const { contact } = navigation.state.params;

    ActionSheetIOS.showActionSheetWithOptions({
      title: contact.address,
      options: ['Cancel', 'Delete'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        return; // Cancel
      }

      navigation.setParams({ loading: true });

      dispatch(removeContact(contact))
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          dispatch(handleError(error));
        })
        .finally(() => {
          navigation.setParams({ loading: false });
        });
    });
  }

  _onContactRequestAccept(contact) {
    this.props.navigation.setParams({ contact });
  }

  _onContactRequestIgnore() {
    this.props.navigation.goBack();
  }

  _onContactRequestDelete() {
    this.props.navigation.goBack();
  }

  _renderContactRequest(contact) {
    return (
      <ContactRequestContainer
        contact={contact}
        onAccept={this._onContactRequestAccept}
        onIgnore={this._onContactRequestIgnore}
        onDelete={this._onContactRequestDelete}
      />
    );
  }

  render() {
    const { contact } = this.props.navigation.state.params;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={styles.content}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            { contact.contactRequest ? this._renderContactRequest(contact) : null }
          </ScrollView>
        </ContentView>
      </BaseScreen>
    );
  }
}

ConversationScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
