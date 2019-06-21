import React, { Component } from 'react';

import {
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeepAwake from 'react-native-keep-awake';
import Icon from 'react-native-vector-icons/Ionicons';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { reset as resetApp } from '../actions';
import { reset as navigateWithReset } from '../actions/navigate';
import { handle as handleError } from '../actions/error';
import * as walletActions from '../actions/bitcoin/wallet';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import { parse as parseAddress } from '../pineApi/address';
import { getById as getUserById } from '../pineApi/user';
import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../pineApi/crypto';
import StyledText from '../components/StyledText';
import Link from '../components/Link';
import Avatar from '../components/Avatar';
import ContentView from '../components/ContentView';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const CONTENT_INSET_BOTTOM = StaticSafeAreaInsets.safeAreaInsetsBottom + ifIphoneX(50, 60);

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
    alignSelf: 'stretch',
    paddingTop: 16,
    marginHorizontal: 16
  },
  backup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  backupTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 15
  },
  chevron: {
    position: 'absolute',
    right: 0,
    fontSize: 20,
    color: '#C7C7CC',
    paddingTop: 2
  },
  loader: {
    position: 'absolute',
    top: 1,
    right: 0,
    height: 42
  },
  footer: {
    left: 0,
    right: 0
  },
  enterKey: {
    fontWeight: '400'
  }
});

@connect((state) => ({
  defaultPineAddressHostname: state.settings.defaultPineAddressHostname
}))
export default class RecoverScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    backups: [],
    recovering: null
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(keyActions.getBackups()).then((backups) => {
      this.setState({ backups });
    });
  }

  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  _showCreatePineAddressScreen() {
    const { dispatch } = this.props;
    return dispatch(navigateWithReset('CreatePineAddress'));
  }

  _showDisclaimerScreen() {
    const { dispatch } = this.props;
    return dispatch(navigateWithReset('Disclaimer'));
  }

  _showImportMnemonicScreen() {
    const { navigation } = this.props;
    navigation.navigate('ImportMnemonic');
  }

  _flagAsInitialized() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      initialized: true
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _recover(backup) {
    const { dispatch } = this.props;

    KeepAwake.activate();
    this.setState({ recovering: backup });

    InteractionManager.runAfterInteractions(() => {
      const keepSettings = false;
      const keepBackup = true;

      // Reset the app in case the last recovery failed.
      return dispatch(resetApp(keepSettings, keepBackup))
        .then(() => {
          return dispatch(keyActions.add(backup.mnemonic));
        })
        .then(() => {
          return dispatch(walletActions.init());
        })
        .then(() => {
          return this._tryRecoverUser(backup);
        })
        .then((user) => {
          this._flagAsInitialized();

          if (!user) {
            // No Pine user was found for the mnemonic, ask user to create one.
            return this._showCreatePineAddressScreen();
          }

          return this._showDisclaimerScreen();
        })
        .catch((error) => {
          dispatch(handleError(error));
          this.setState({ recovering: null });
          KeepAwake.deactivate();
        });
    });
  }

  _tryRecoverUser({ pineAddress, mnemonic }) {
    const { dispatch, defaultPineAddressHostname } = this.props;
    const hostname = pineAddress ? parseAddress(pineAddress).hostname : defaultPineAddressHostname;
    const keyPair = getKeyPairFromMnemonic(mnemonic);
    const userId = getUserIdFromPublicKey(keyPair.publicKey);

    return getUserById(userId, hostname)
      .catch(() => {})
      .then((user) => {
        if (user) {
          // A Pine user was found for the mnemonic, save it to settings.
          const address = `${user.username}@${hostname}`;
          dispatch(settingsActions.saveUserProfile(address, user));
        }

        return user;
      });
  }

  _renderBackups() {
    const { backups, recovering } = this.state;

    return backups.map((backup, index) => {
      return (
        <TouchableOpacity key={index} style={styles.backup} onPress={this._recover.bind(this, backup)} disabled={Boolean(recovering)}>
          <Avatar pineAddress={backup.pineAddress} checksum={Date.now().toString()} size={40} />
          <StyledText style={styles.backupTitle}>
            {backup.pineAddress}
          </StyledText>

          { (recovering !== backup) ? <Icon name='ios-arrow-forward' style={styles.chevron} /> : null }
          { (recovering === backup) ? <ActivityIndicator animating={true} color='#8A8A8F' style={styles.loader} size='small' /> : null }
        </TouchableOpacity>
      );
    });
  }

  render() {
    const { recovering } = this.state;

    return (
      <BaseScreen headerTitle='Recover Account' style={styles.view}>
        <StatusBar barStyle='dark-content' />

        <ContentView style={styles.content}>
          <ScrollView
            style={styles.scrollView}
            contentInset={{ bottom: CONTENT_INSET_BOTTOM }}
            showsVerticalScrollIndicator={false}
          >
            { this._renderBackups() }
          </ScrollView>
        </ContentView>

        <Footer style={styles.footer}>
          <Link onPress={this._showImportMnemonicScreen.bind(this)} disabled={Boolean(recovering)} labelStyle={styles.enterKey}>
            Enter Recovery Key
          </Link>
        </Footer>
      </BaseScreen>
    );
  }
}

RecoverScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  defaultPineAddressHostname: PropTypes.string
};
