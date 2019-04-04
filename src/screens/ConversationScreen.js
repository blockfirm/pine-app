import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ActionSheetIOS,
  ActivityIndicator,
  Keyboard,
  LayoutAnimation
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { handle as handleError } from '../actions/error/handle';
import { remove as removeContact, markAsRead } from '../actions/contacts';
import headerStyles from '../styles/headerStyles';
import ContentView from '../components/ContentView';
import HeaderTitle from '../components/conversation/HeaderTitle';
import BackButton from '../components/BackButton';
import Avatar from '../components/Avatar';
import ConfirmTransactionContainer from '../containers/conversation/ConfirmTransactionContainer';
import ContactRequestContainer from '../containers/conversation/ContactRequestContainer';
import InputBarContainer from '../containers/conversation/InputBarContainer';
import BaseScreen from './BaseScreen';

const KEYBOARD_MARGIN_TOP = 5;

const KEYBOARD_TOP_SPACING = ifIphoneX(
  KEYBOARD_MARGIN_TOP - StaticSafeAreaInsets.safeAreaInsetsBottom,
  -KEYBOARD_MARGIN_TOP
);

const styles = StyleSheet.create({
  view: {
    padding: 0
  },
  content: {
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: ifIphoneX(0, 10),
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  scrollView: {
    flex: 1,
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
      headerTitle: <HeaderTitle contact={contact} />,
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight: contact.contactRequest ? null : headerRight
    };
  };

  state = {
    confirmTransaction: false,
    amountBtc: 0,
    displayUnit: 'BTC',
    keyboardHeight: 0,
    keyboardAnimationDuration: 300,
    keyboardAnimationEasing: null,
    keyboardIsVisible: false
  }

  constructor() {
    super(...arguments);

    this._listeners = [];

    this._onContactRequestAccept = this._onContactRequestAccept.bind(this);
    this._onContactRequestIgnore = this._onContactRequestIgnore.bind(this);
    this._onContactRequestDelete = this._onContactRequestDelete.bind(this);

    this._onSendPress = this._onSendPress.bind(this);
    this._onCancelPress = this._onCancelPress.bind(this);
    this._onTransactionSent = this._onTransactionSent.bind(this);

    this._onKeyboardDidShow = this._onKeyboardDidShow.bind(this);
    this._onKeyboardDidHide = this._onKeyboardDidHide.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setParams({ showUserMenu: this._showUserMenu.bind(this) });

    this._markConversationAsRead();

    this._listeners.push(
      Keyboard.addListener('keyboardDidShow', this._onKeyboardDidShow)
    );

    this._listeners.push(
      Keyboard.addListener('keyboardDidHide', this._onKeyboardDidHide)
    );
  }

  componentWillUnmount() {
    this._markConversationAsRead();

    this._listeners.forEach((listener) => {
      if (!listener.removed) {
        listener.remove();
        listener.removed = true;
      }
    });
  }

  _onKeyboardDidShow(event) {
    this.setState({
      keyboardHeight: event.endCoordinates.height,
      keyboardAnimationDuration: event.duration,
      keyboardAnimationEasing: event.easing,
      keyboardIsVisible: true
    });
  }

  _onKeyboardDidHide() {
    this.setState({ keyboardIsVisible: false });
  }

  _markConversationAsRead() {
    const { dispatch, navigation } = this.props;
    const { contact } = navigation.state.params;

    dispatch(markAsRead(contact));
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

  _onSendPress({ amountBtc, displayUnit }) {
    this.setState({
      confirmTransaction: true,
      amountBtc,
      displayUnit
    });

    if (this.state.keyboardIsVisible) {
      return Keyboard.dismiss();
    }

    const animation = LayoutAnimation.create(
      this.state.keyboardAnimationDuration,
      LayoutAnimation.Types[this.state.keyboardAnimationEasing],
      LayoutAnimation.Properties.opacity,
    );

    LayoutAnimation.configureNext(animation);
  }

  _onCancelPress() {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this.setState({ confirmTransaction: false });

      if (!keyboardDidShowListener.removed) {
        keyboardDidShowListener.remove();
        keyboardDidShowListener.removed = true;
      }
    });

    this._listeners.push(keyboardDidShowListener);
  }

  _onTransactionSent() {
    const animation = LayoutAnimation.create(
      this.state.keyboardAnimationDuration,
      LayoutAnimation.Types[this.state.keyboardAnimationEasing],
      LayoutAnimation.Properties.opacity,
    );

    LayoutAnimation.configureNext(animation);

    this.setState({ confirmTransaction: false });
    this._inputBar.reset();
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

  _renderInputBar() {
    return (
      <InputBarContainer
        ref={(ref) => { this._inputBar = ref && ref.getWrappedInstance(); }}
        onSendPress={this._onSendPress}
        onCancelPress={this._onCancelPress}
      />
    );
  }

  _renderConfirmTransactionView() {
    const { contact } = this.props.navigation.state.params;

    const {
      keyboardHeight,
      confirmTransaction,
      keyboardIsVisible,
      amountBtc,
      displayUnit
    } = this.state;

    if (!keyboardHeight) {
      return;
    }

    const style = {
      marginTop: KEYBOARD_MARGIN_TOP,
      marginBottom: confirmTransaction ? 0 : -(keyboardHeight + KEYBOARD_MARGIN_TOP),
      opacity: confirmTransaction ? 1 : 0,
      minHeight: keyboardHeight
    };

    return (
      <ConfirmTransactionContainer
        style={style}
        amountBtc={amountBtc}
        displayUnit={displayUnit}
        contact={contact}
        onTransactionSent={this._onTransactionSent}
      />
    );
  }

  render() {
    const { contact } = this.props.navigation.state.params;
    const { confirmTransaction } = this.state;

    const contentStyle = [
      styles.content,
      confirmTransaction && { paddingBottom: 0, marginBottom: 0 }
    ];

    const keyboardSpacerStyle = confirmTransaction && { position: 'absolute' };

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={contentStyle}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            { contact.contactRequest && this._renderContactRequest(contact) }
          </ScrollView>
          { !contact.contactRequest && this._renderInputBar() }
          { this._renderConfirmTransactionView() }
          <KeyboardSpacer style={keyboardSpacerStyle} topSpacing={KEYBOARD_TOP_SPACING} />
        </ContentView>
      </BaseScreen>
    );
  }
}

ConversationScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
