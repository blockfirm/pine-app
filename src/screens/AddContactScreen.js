import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AppleEasing from 'react-apple-easing';

import { send as sendContactRequest } from '../actions/pine/contactRequests/send';
import { add as addContact } from '../actions/contacts/add';
import { parse as parseAddress } from '../pineApi/address';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';
import headerStyles from '../styles/headerStyles';
import HeaderButton from '../components/buttons/HeaderButton';
import CancelButton from '../components/CancelButton';
import StyledText from '../components/StyledText';
import BaseScreen from './BaseScreen';

const TOP_MARGIN = getStatusBarHeight() + getNavBarHeight();

const styles = StyleSheet.create({
  view: {
    padding: 0,
    paddingHorizontal: 16,
    alignItems: 'flex-start'
  },
  inputWrapper: {
    width: '100%'
  },
  input: {
    fontSize: 24
  },
  inputTitleWrapper: {
    position: 'absolute'
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 35,
    position: 'absolute'
  }
});

@connect((state) => ({
  contacts: state.contacts.items,
  userProfile: state.settings.user.profile,
  defaultPineAddressHostname: state.settings.defaultPineAddressHostname
}))
export default class AddContactScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const nextIsDisabled = !navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');
    const headerLeft = <CancelButton onPress={screenProps.dismiss} />;
    const headerRight = <HeaderButton label='Add' onPress={submit} disabled={nextIsDisabled} />;

    return {
      title: 'Add Contact',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft,
      headerRight
    };
  };

  constructor(props) {
    super(...arguments);

    this.state = {
      address: '',
      error: '',
      animatedTitleOpacity: new Animated.Value(0),
      animatedTitleMargin: new Animated.Value(-20)
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ canSubmit: false });
    this.props.navigation.setParams({ submit: this._onSubmit.bind(this) });
  }

  _getFullAddress(address) {
    const { defaultPineAddressHostname } = this.props;

    if (address.indexOf('@') === -1) {
      return `${address}@${defaultPineAddressHostname}`;
    }

    return address;
  }

  _onSubmit() {
    const { dispatch, contacts, userProfile } = this.props;
    const fullAddress = this._getFullAddress(this.state.address);

    this.props.navigation.setParams({ canSubmit: false });

    if (fullAddress === userProfile.address) {
      return this.setState({ error: '👆 Hey, that\'s you' });
    }

    const existing = Object.values(contacts).find((contact) => {
      return contact.address === fullAddress;
    });

    if (existing) {
      return this.setState({ error: 'You already have that contact' });
    }

    return dispatch(sendContactRequest(fullAddress))
      .then((contact) => {
        contact.address = fullAddress;
        return dispatch(addContact(contact));
      })
      .then(() => {
        this.props.screenProps.dismiss();
      })
      .catch((error) => {
        this.setState({ error: error.message });
      })
      .then(() => {
        this.props.navigation.setParams({ canSubmit: true });
      });
  }

  _validateAddress(address) {
    this.setState({ error: '' });
    this.props.navigation.setParams({ canSubmit: false });

    if (!address) {
      return;
    }

    const fullAddress = this._getFullAddress(address);

    try {
      parseAddress(fullAddress);
      this.props.navigation.setParams({ canSubmit: true });
    } catch (error) {
      // Suppress error.
    }
  }

  _onChangeText(text) {
    const address = text.toLowerCase().trim();

    this.setState({ address });
    this._validateAddress(address);
  }

  _showInputTitle() {
    const { animatedTitleOpacity, animatedTitleMargin } = this.state;

    Animated.parallel([
      Animated.timing(animatedTitleOpacity, {
        toValue: 1,
        duration: 200,
        easing: AppleEasing.default
      }),
      Animated.timing(animatedTitleMargin, {
        toValue: -20,
        duration: 200,
        easing: AppleEasing.default
      })
    ]).start();
  }

  _hideInputTitle() {
    const { animatedTitleOpacity, animatedTitleMargin } = this.state;

    Animated.timing(animatedTitleOpacity, {
      toValue: 0,
      duration: 100,
      easing: AppleEasing.default
    }).start(() => {
      animatedTitleMargin.setValue(0);
    });
  }

  _renderInputTitle() {
    const { animatedTitleOpacity, animatedTitleMargin } = this.state;

    const style = [
      styles.inputTitleWrapper,
      {
        opacity: animatedTitleOpacity,
        marginTop: animatedTitleMargin
      }
    ];

    if (this.state.address) {
      this._showInputTitle();
    } else {
      this._hideInputTitle();
    }

    return (
      <Animated.View style={style}>
        <StyledText style={styles.inputTitle}>
          Enter Pine Address
        </StyledText>
      </Animated.View>
    );
  }

  render() {
    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <View style={styles.inputWrapper}>
          { this._renderInputTitle() }
          <TextInput
            style={styles.input}
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
            maxLength={71}
            value={this.state.address}
            selectionColor='#FFC431'
            onChangeText={(text) => this._onChangeText(text)}
            placeholder='Enter Pine Address'
            blurOnSubmit={false}
          />
          <StyledText style={styles.error}>
            {this.state.error}
          </StyledText>
        </View>
        <KeyboardSpacer topSpacing={-TOP_MARGIN} />
      </BaseScreen>
    );
  }
}

AddContactScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  contacts: PropTypes.object,
  screenProps: PropTypes.object,
  userProfile: PropTypes.object,
  defaultPineAddressHostname: PropTypes.string
};
