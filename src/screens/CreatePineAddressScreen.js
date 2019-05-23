import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Icon from 'react-native-vector-icons/Entypo';

import {
  validateUsername,
  UsernameContainsInvalidCharsError
} from '../pineApi/address';

import { reset as navigateWithReset } from '../actions/navigate';
import * as settingsActions from '../actions/settings';
import * as keyActions from '../actions/keys';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { create as createUser } from '../pineApi/user';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';
import headerStyles from '../styles/headerStyles';
import HeaderButton from '../components/buttons/HeaderButton';
import StyledText from '../components/StyledText';
import Paragraph from '../components/Paragraph';
import BaseScreen from './BaseScreen';

const TOP_MARGIN = getStatusBarHeight() + getNavBarHeight();

const styles = StyleSheet.create({
  view: {
    padding: 0,
    paddingHorizontal: 16,
    alignItems: 'flex-start'
  },
  content: {
    flexGrow: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
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
  },
  betaNoticeWrapper: {
    position: 'absolute',
    bottom: 16,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  betaNotice: {
    fontSize: 12,
    lineHeight: 15,
    marginBottom: 0,
    marginLeft: 10
  },
  infoIcon: {
    color: '#B1AFB7'
  }
});

@connect((state) => ({
  keys: state.keys.items,
  defaultPineAddressHostname: state.settings.defaultPineAddressHostname,
  bitcoinNetwork: state.settings.bitcoin.network,
  hasCreatedBackup: state.settings.user.hasCreatedBackup
}))
export default class CreatePineAddressScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const nextIsDisabled = !navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');
    const headerRight = <HeaderButton label='Next' onPress={submit} disabled={nextIsDisabled} />;

    return {
      title: 'Pick a Username',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerRight
    };
  };

  constructor(props) {
    super(...arguments);

    this.state = {
      domain: props.defaultPineAddressHostname,
      username: '',
      error: ''
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ canSubmit: false });
    this.props.navigation.setParams({ submit: this._onSubmit.bind(this) });
  }

  _showDisclaimerScreen() {
    const { dispatch } = this.props;
    return dispatch(navigateWithReset('Disclaimer'));
  }

  _onSubmit() {
    const { dispatch, bitcoinNetwork, hasCreatedBackup } = this.props;
    const { username, domain } = this.state;
    const pineAddress = `${username}@${domain}`;
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
    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <StatusBar barStyle='dark-content' />

        <View style={styles.content}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize='none'
              maxLength={20}
              value={this.state.username}
              selectionColor='#FFC431'
              onChangeText={(text) => this._onChangeText(text)}
              blurOnSubmit={false}
            />
            <View style={styles.suffixWrapper} pointerEvents='none'>
              <Text style={styles.suffixPadding}>{this.state.username}</Text>
              <Text style={styles.suffix}>@{this.state.domain}</Text>
            </View>
            <StyledText style={styles.error}>
              {this.state.error}
            </StyledText>
          </View>

          <View style={styles.betaNoticeWrapper}>
            <Icon name='info-with-circle' style={styles.infoIcon} />
            <Paragraph style={styles.betaNotice}>
              During the beta it is not possible to use your own Pine server and domain name.
            </Paragraph>
            <KeyboardSpacer topSpacing={-TOP_MARGIN} />
          </View>
        </View>

        <KeyboardSpacer topSpacing={-TOP_MARGIN} />
      </BaseScreen>
    );
  }
}

CreatePineAddressScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  keys: PropTypes.object,
  defaultPineAddressHostname: PropTypes.string,
  bitcoinNetwork: PropTypes.string,
  hasCreatedBackup: PropTypes.bool
};
