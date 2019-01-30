import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  validateUsername,
  UsernameTooLongError,
  UsernameContainsInvalidCharsError
} from '../PinePaymentProtocol/address';

import { navigateWithReset } from '../actions';
import * as settingsActions from '../actions/settings';
import { handle as handleError } from '../actions/error/handle';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { create as createUser, get as getUser } from '../PinePaymentProtocol/user';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';
import headerStyles from '../styles/headerStyles';
import HeaderButton from '../components/buttons/HeaderButton';
import StyledText from '../components/StyledText';
import BaseScreen from './BaseScreen';

const TOP_MARGIN = getStatusBarHeight() + getNavBarHeight();
const DEFAULT_PINE_DOMAIN = '192.168.1.199';

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
  suffixWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    marginLeft: 3
  },
  suffixPadding: {
    opacity: 0,
    fontSize: 24
  },
  suffix: {
    fontSize: 24,
    color: '#C8C7CC'
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 35,
    position: 'absolute'
  }
});

@connect((state) => ({
  keys: state.keys.items
}))
export default class CreatePineAddressScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const nextIsDisabled = !navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');
    const headerRight = <HeaderButton label='Next' onPress={submit} disabled={nextIsDisabled} />;

    return {
      title: 'Enter a Username',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerRight
    };
  };

  state = {
    domain: DEFAULT_PINE_DOMAIN,
    username: '',
    error: ''
  };

  componentDidMount() {
    this.props.navigation.setParams({ canSubmit: false });
    this.props.navigation.setParams({ submit: this._onSubmit.bind(this) });
  }

  _showDisclaimerScreen() {
    const { dispatch } = this.props;
    return dispatch(navigateWithReset('Disclaimer'));
  }

  _savePineAddress(pineAddress) {
    const { dispatch } = this.props;

    const newSettings = {
      user: { pineAddress }
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _onSubmit() {
    const { dispatch } = this.props;
    const { username, domain } = this.state;
    const pineAddress = `${username}@${domain}`;

    this.props.navigation.setParams({ canSubmit: false });

    return this._getMnemonic()
      .then((mnemonic) => {
        return createUser(pineAddress, mnemonic);
      })
      .then((user) => {
        this._savePineAddress(pineAddress);
        this._showDisclaimerScreen();
      })
      .catch((error) => {
        if (error.message.indexOf('username already exists') > -1) {
          this.setState({ error: 'Username has already been taken' });
        } else if (error.message.indexOf('reserved') > -1) {
          this.setState({ error: 'Username is reserved' });
        } else if (error.message.indexOf('too short') > -1) {
          this.setState({ error: 'Username is too short' });
        } else {
          this.setState({ error: error.message });
        }
      })
      .then(() => {
        this.props.navigation.setParams({ canSubmit: true });
      });
  }

  _getMnemonic() {
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    return getMnemonicByKey(defaultKey.id);
  }

  _validateUsername(username) {
    this.setState({ error: '' });
    this.props.navigation.setParams({ canSubmit: false });

    if (!username) {
      return;
    }

    try {
      if (validateUsername(username)) {
        this.props.navigation.setParams({ canSubmit: true });
      }
    } catch (error) {
      let errorMessage = error.message;

      if (error instanceof UsernameContainsInvalidCharsError) {
        errorMessage = 'Your username can only contain lowercase letters, numbers, underscores and periods';
      }

      this.setState({ error: errorMessage });
    }
  }

  _onChangeText(text) {
    const username = text.toLowerCase().trim();

    this.setState({ username });
    this._validateUsername(username);
  }

  render() {
    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <StatusBar barStyle='dark-content' />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize='none'
            maxLength={30}
            value={this.state.username}
            onChangeText={(text) => this._onChangeText(text)}
          />
          <View style={styles.suffixWrapper} pointerEvents='none'>
            <Text style={styles.suffixPadding}>{this.state.username}</Text>
            <Text style={styles.suffix}>@{this.state.domain}</Text>
          </View>
          <StyledText style={styles.error}>
            {this.state.error}
          </StyledText>
        </View>
        <KeyboardSpacer topSpacing={-TOP_MARGIN} />
      </BaseScreen>
    );
  }
}

CreatePineAddressScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  keys: PropTypes.object
};
