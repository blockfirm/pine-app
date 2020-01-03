/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Text, TextInput, Dimensions, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  validateUsername,
  UsernameContainsInvalidCharsError
} from '../clients/paymentServer/address';

import { withTheme } from '../contexts/theme';
import { reset as navigateWithReset } from '../actions/navigate';
import * as settingsActions from '../actions/settings';
import * as keyActions from '../actions/keys';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { create as createUser } from '../clients/paymentServer/user';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';
import headerStyles from '../styles/headerStyles';
import ChangeServerButtonContainer from '../containers/buttons/ChangeServerButtonContainer';
import HeaderTitle from '../components/HeaderTitle';
import HeaderBackground from '../components/HeaderBackground';
import HeaderButton from '../components/buttons/HeaderButton';
import CancelButton from '../components/CancelButton';
import StyledText from '../components/StyledText';
import BaseScreen from './BaseScreen';

const WINDOW_WIDTH = Dimensions.get('window').width;
const TOP_MARGIN = getStatusBarHeight() + getNavBarHeight();

const styles = StyleSheet.create({
  view: {
    padding: 0,
    paddingHorizontal: 16,
    alignItems: 'flex-start'
  },
  content: {
    flexGrow: 1,
    marginTop: TOP_MARGIN,
    justifyContent: 'center'
  },
  inputWrapper: {
    width: '100%'
  },
  input: {
    fontSize: 24,
    width: WINDOW_WIDTH
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
    fontSize: 24
  },
  error: {
    width: '100%',
    fontSize: 12,
    marginTop: 35,
    position: 'absolute'
  },
  changeServerWrapper: {
    position: 'absolute',
    bottom: 16,
    marginRight: 16
  }
});

@connect((state) => ({
  keys: state.keys.items,
  defaultPineAddressHostname: state.settings.defaultPineAddressHostname,
  pineAddressHostname: state.settings.pineAddressHostname,
  bitcoinNetwork: state.settings.bitcoin.network,
  hasCreatedBackup: state.settings.user.hasCreatedBackup,
  navIndex: state.nav.index
}))
class CreatePineAddressScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const nextIsDisabled = !navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');
    const cancel = navigation.getParam('cancel');
    const headerLeft = <CancelButton onPress={cancel} />;
    const headerRight = <HeaderButton label='Next' onPress={submit} disabled={nextIsDisabled} />;

    return {
      headerTransparent: true,
      headerBackground: <HeaderBackground />,
      headerTitle: <HeaderTitle title='Pick a Username' />,
      headerStyle: headerStyles.borderlessHeader,
      headerLeft,
      headerRight
    };
  };

  state = {
    username: '',
    error: ''
  };

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setParams({ canSubmit: false });
    navigation.setParams({ submit: this._onSubmit.bind(this) });
    navigation.setParams({ cancel: this._cancel.bind(this) });
  }

  componentDidUpdate(prevProps) {
    if (this.props.navIndex === 0 && prevProps.navIndex > 0) {
      if (this._input && !this._input.isFocused()) {
        setTimeout(() => this._input.focus(), 300);
      }
    }
  }

  _getPineHostname() {
    const { pineAddressHostname, defaultPineAddressHostname } = this.props;
    return pineAddressHostname || defaultPineAddressHostname;
  }

  _showDisclaimerScreen() {
    const { dispatch } = this.props;
    return dispatch(navigateWithReset('Disclaimer'));
  }

  _cancel() {
    const { dispatch } = this.props;
    const keepSettings = false;
    const keepBackup = true;

    dispatch(navigateWithReset('Reset', { keepSettings, keepBackup }));
  }

  _onSubmit() {
    const { dispatch, bitcoinNetwork, hasCreatedBackup } = this.props;
    const { username } = this.state;
    const hostname = this._getPineHostname();
    const pineAddress = `${username}@${hostname}`;
    let mnemonic;
    let user;

    this.props.navigation.setParams({ canSubmit: false });

    return this._getMnemonic()
      .then((_mnemonic) => {
        mnemonic = _mnemonic;
        return createUser(pineAddress, mnemonic, bitcoinNetwork);
      })
      .then((_user) => {
        user = _user;

        if (!hasCreatedBackup) {
          return dispatch(keyActions.backup(mnemonic, pineAddress));
        }
      })
      .then(() => {
        dispatch(settingsActions.saveUserProfile(pineAddress, user));
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
    const { theme } = this.props;
    const hostname = this._getPineHostname();

    const suffixStyle = [
      styles.suffix,
      { color: theme.bigInputPlaceholderColor }
    ];

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <StatusBar barStyle='default' />

        <TouchableWithoutFeedback onPress={() => this._input.focus()}>
          <View style={styles.content}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={(ref) => { this._input = ref; }}
                style={[styles.input, theme.bigInput]}
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize='none'
                maxLength={20}
                value={this.state.username}
                selectionColor={theme.bigInputSelectionColor}
                onChangeText={(text) => this._onChangeText(text)}
                blurOnSubmit={false}
              />
              <View style={styles.suffixWrapper}>
                <Text style={styles.suffixPadding}>{this.state.username}</Text>
                <Text style={suffixStyle}>@{hostname}</Text>
              </View>
              <StyledText style={[styles.error, theme.errorText]}>
                {this.state.error}
              </StyledText>
            </View>

            <View style={styles.changeServerWrapper}>
              <ChangeServerButtonContainer />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <KeyboardSpacer />
      </BaseScreen>
    );
  }
}

CreatePineAddressScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  navIndex: PropTypes.number,
  keys: PropTypes.object,
  defaultPineAddressHostname: PropTypes.string,
  pineAddressHostname: PropTypes.string,
  bitcoinNetwork: PropTypes.string,
  hasCreatedBackup: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(CreatePineAddressScreen);
