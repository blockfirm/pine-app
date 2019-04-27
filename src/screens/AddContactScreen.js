import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
    const headerRight = <HeaderButton label='Done' onPress={submit} disabled={nextIsDisabled} />;

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
      error: ''
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
      return this.setState({ error: '👆 That\'s you' });
    }

    const existing = Object.values(contacts).find((contact) => {
      return contact.address === fullAddress;
    });

    if (existing) {
      return this.setState({ error: '👆 You have already added that contact' });
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

  render() {
    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize='none'
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
