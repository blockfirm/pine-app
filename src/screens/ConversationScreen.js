import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActionSheetIOS,
  ActivityIndicator,
  Keyboard,
  LayoutAnimation,
  Linking
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { closeConversation, setHomeScreenIndex } from '../actions/navigate';
import { handle as handleError } from '../actions/error/handle';
import { remove as removeContact, markAsRead } from '../actions/contacts';

import {
  load as loadMessages,
  removeAllForContact as removeAllMessagesForContact
} from '../actions/messages';

import vendors from '../vendors';
import headerStyles from '../styles/headerStyles';
import ContentView from '../components/ContentView';
import HeaderTitle from '../components/conversation/HeaderTitle';
import EmptyConversation from '../components/conversation/EmptyConversation';
import Messages from '../components/conversation/Messages';
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
    right: 16
  }
});

@connect((state) => ({
  contacts: state.contacts.items,
  messages: state.messages.itemsByContact
}))
export default class ConversationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { contact, bitcoinAddress, showUserMenu, loading } = navigation.state.params;
    const avatarChecksum = contact && contact.avatar && contact.avatar.checksum;
    let headerTitle;
    let headerRight;

    if (contact) {
      headerTitle = <HeaderTitle contact={contact} />;
    } else {
      headerTitle = <HeaderTitle contact={{ address: bitcoinAddress, isBitcoinAddress: true }} />;
    }

    if (loading) {
      headerRight = (
        <ActivityIndicator color='gray' size='small' style={styles.headerLoader} />
      );
    } else {
      headerRight = (
        <TouchableOpacity onPress={showUserMenu} style={styles.headerAvatar} disable={loading}>
          <Avatar
            pineAddress={contact && contact.address}
            vendorId={contact && contact.vendorId}
            checksum={avatarChecksum}
            size={36}
          />
        </TouchableOpacity>
      );
    }

    return {
      headerTitle,
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight: (contact && contact.contactRequest) ? null : headerRight
    };
  };

  state = {
    confirmTransaction: false,
    amountBtc: 0,
    displayCurrency: 'BTC',
    displayUnit: 'BTC',
    keyboardHeight: 0,
    keyboardAnimationDuration: 300,
    keyboardAnimationEasing: null,
    keyboardIsVisible: false,
    messagesLoaded: false
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
    const { dispatch, navigation, contacts, messages } = this.props;
    const { contactId, autoFocus } = navigation.state.params;
    let contact;

    if (contactId) {
      contact = contacts[contactId];
      navigation.setParams({ contact });
    }

    navigation.setParams({ showUserMenu: this._showUserMenu.bind(this) });

    this._listeners.push(
      Keyboard.addListener('keyboardDidShow', this._onKeyboardDidShow)
    );

    this._listeners.push(
      Keyboard.addListener('keyboardDidHide', this._onKeyboardDidHide)
    );

    if (contact && !messages[contact.id]) {
      dispatch(loadMessages(contact.id)).then(() => {
        this.setState({ messagesLoaded: true });
      });
    } else {
      this.setState({ messagesLoaded: true });
    }

    if (autoFocus && this._inputBar) {
      setTimeout(() => {
        this._inputBar.focus();
      });
    }

    // Mark this conversation as read after 1s.
    this._conversationReadTimer = setTimeout(() => {
      this._markConversationAsRead();
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this._conversationReadTimer);
  }

  componentDidUpdate(prevProps) {
    const { navigation, contacts } = this.props;
    const prevContact = prevProps.navigation.state.params.contact;

    if (!prevContact || !prevContact.id) {
      return;
    }

    const contact = contacts[prevContact.id];

    if (!contact) {
      return;
    }

    const prevAvatarChecksum = prevContact.avatar && prevContact.avatar.checksum;
    const avatarChecksum = contact.avatar && contact.avatar.checksum;

    if (
      contact.displayName !== prevContact.displayName ||
      avatarChecksum !== prevAvatarChecksum ||
      (prevContact.contactRequest && !contact.contactRequest)
    ) {
      navigation.setParams({ contact });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    this._markConversationAsRead();

    this._listeners.forEach((listener) => {
      if (!listener.removed) {
        listener.remove();
        listener.removed = true;
      }
    });

    dispatch(closeConversation());
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

    if (contact) {
      dispatch(markAsRead(contact));
    }
  }

  _removeContactAndConversation() {
    const { dispatch, navigation } = this.props;
    const { contact } = navigation.state.params;

    navigation.setParams({ loading: true });

    return dispatch(removeContact(contact))
      .then(() => {
        return dispatch(removeAllMessagesForContact(contact.id));
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        dispatch(handleError(error));
      })
      .finally(() => {
        navigation.setParams({ loading: false });
      });
  }

  _showUserMenu() {
    const { navigation } = this.props;
    const { contact } = navigation.state.params;
    const options = ['Cancel', 'Delete Contact'];

    if (!contact) {
      return;
    }

    let title = contact.address || contact.displayName || undefined;

    if (contact.isVendor) {
      title = vendors.get(contact.vendorId).displayName;
      options.push('Visit Website');
    }

    ActionSheetIOS.showActionSheetWithOptions({
      title,
      options,
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      let title;

      if (buttonIndex === 0) {
        return; // Cancel
      }

      if (contact.isVendor && buttonIndex === 2) {
        const vendor = vendors.get(contact.vendorId);
        return Linking.openURL(vendor.url);
      }

      if (contact.isBitcoinAddress || contact.isVendor) {
        title = 'Deleting this contact will also delete its payment history.';
      } else {
        title = 'Deleting this contact will also delete its payment history and will prevent this contact from sending you any more bitcoin.';
      }

      ActionSheetIOS.showActionSheetWithOptions({
        title,
        options: ['Cancel', 'Delete'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0
      }, (buttonIndex) => {
        if (buttonIndex === 1) {
          this._removeContactAndConversation();
        }
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

  _onSendPress({ amountBtc, displayCurrency, displayUnit }) {
    this.setState({
      confirmTransaction: true,
      amountBtc,
      displayCurrency,
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

  _onTransactionSent({ createdContact }) {
    const { dispatch, navigation } = this.props;

    const animation = LayoutAnimation.create(
      this.state.keyboardAnimationDuration,
      LayoutAnimation.Types[this.state.keyboardAnimationEasing],
      LayoutAnimation.Properties.opacity,
    );

    LayoutAnimation.configureNext(animation);

    this.setState({
      confirmTransaction: false,
      amountBtc: 0
    });

    if (this._inputBar) {
      this._inputBar.reset();
    }

    if (createdContact) {
      navigation.setParams({ contact: createdContact });
    }

    dispatch(setHomeScreenIndex(1));
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

  _renderEmptyConversation(contact) {
    return (
      <EmptyConversation contact={contact} />
    );
  }

  _renderInputBar() {
    const { contact, amount } = this.props.navigation.state.params;
    const disabled = Boolean(contact && !contact.address);

    return (
      <InputBarContainer
        ref={(ref) => { this._inputBar = ref && ref.getWrappedInstance(); }}
        onSendPress={this._onSendPress}
        onCancelPress={this._onCancelPress}
        initialAmountBtc={amount}
        disabled={disabled}
      />
    );
  }

  _renderConfirmTransactionView() {
    const { contact, bitcoinAddress } = this.props.navigation.state.params;

    const {
      keyboardHeight,
      confirmTransaction,
      amountBtc,
      displayCurrency,
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
        displayCurrency={displayCurrency}
        displayUnit={displayUnit}
        contact={contact}
        bitcoinAddress={bitcoinAddress}
        onTransactionSent={this._onTransactionSent}
      />
    );
  }

  renderContent() {
    const { messages, navigation } = this.props;
    const { contact } = navigation.state.params;

    if (!contact) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        />
      );
    }

    const contactMessages = messages[contact.id] || [];

    if (!contact.contactRequest && contactMessages.length > 0) {
      return <Messages messages={contactMessages} contact={contact} />;
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        { contact.contactRequest && this._renderContactRequest(contact) }
        { !contact.contactRequest && !contactMessages.length && this._renderEmptyConversation(contact) }
      </ScrollView>
    );
  }

  render() {
    const { navigation } = this.props;
    const { contact } = navigation.state.params;
    const { confirmTransaction } = this.state;
    const hasContactRequest = Boolean(contact && contact.contactRequest);

    const contentStyle = [
      styles.content,
      confirmTransaction && { paddingBottom: 0, marginBottom: 0 }
    ];

    const keyboardSpacerStyle = confirmTransaction && { position: 'absolute' };

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <ContentView style={contentStyle}>
          { this.renderContent() }
          { !hasContactRequest && this._renderInputBar() }
          { this._renderConfirmTransactionView() }
          <KeyboardSpacer style={keyboardSpacerStyle} topSpacing={KEYBOARD_TOP_SPACING} />
        </ContentView>
      </BaseScreen>
    );
  }
}

ConversationScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  contacts: PropTypes.object,
  messages: PropTypes.object
};
