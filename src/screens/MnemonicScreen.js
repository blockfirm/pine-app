import React, { Component } from 'react';
import { StyleSheet, StatusBar, Alert, ActivityIndicator, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { navigateWithReset } from '../actions';
import { handle as handleError } from '../actions/error/handle';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import { getUnused as getUnusedAddress } from '../actions/bitcoin/wallet/addresses';
import MnemonicWordsContainer from '../containers/MnemonicWordsContainer';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Link from '../components/Link';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  mnemonic: {
    marginTop: 10,
    marginBottom: 10
  },
  paragraph: {
    textAlign: 'center',
    position: 'absolute',
    top: ifIphoneX(140, 85)
  },
  link: {
    marginTop: 10
  },
  loader: {
    marginTop: 24.5,
    marginBottom: 15
  }
});

@connect((state) => ({
  recoveryKeyRevealed: state.recoveryKey.visible
}))
export default class MnemonicScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    storingInICloud: false
  }

  _showConfirmMnemonicScreen() {
    const navigation = this.props.navigation;
    const { params } = navigation.state;
    const mnemonic = params.mnemonic;

    navigation.navigate('ConfirmMnemonic', { mnemonic });
  }

  _showDisclaimerScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Disclaimer'));
  }

  _flagAsInitialized() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      initialized: true
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _saveKey() {
    const dispatch = this.props.dispatch;
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;

    // Save key metadata with public key.
    return dispatch(keyActions.add(mnemonic))
      .then(() => {
        // Flag that the user has set up the app for the first time.
        return this._flagAsInitialized();
      })
      .then(() => {
        // Load an unused address into state.
        return Promise.all([
          dispatch(getUnusedAddress()), // External address.
          dispatch(getUnusedAddress(true)) // Internal address.
        ]);
      })
      .then(() => {
        return this._showDisclaimerScreen();
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _storeInICloud() {
    const dispatch = this.props.dispatch;
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;

    return dispatch(keyActions.backup(mnemonic))
      .then(() => {
        return this._saveKey();
      })
      .catch((error) => {
        dispatch(handleError(error));
        this.setState({ storingInICloud: false });
      });
  }

  _showStoreInICloudConfirmation() {
    Alert.alert(
      'Back up in iCloud?',
      'Saving your recovery key in your iCloud account is potentially less secure than writing it down and storing it yourself.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Store in iCloud',
          onPress: () => {
            this.setState({ storingInICloud: true });

            InteractionManager.runAfterInteractions(() => {
              this._storeInICloud();
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  _renderICloudLink() {
    if (this.state.storingInICloud) {
      return (
        <ActivityIndicator animating={true} style={styles.loader} size='small' />
      );
    }

    return (
      <Link onPress={this._showStoreInICloudConfirmation.bind(this)} style={styles.link}>
        Store in iCloud instead
      </Link>
    );
  }

  render() {
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;

    return (
      <BaseScreen headerTitle='Your Recovery Key'>
        <StatusBar barStyle='dark-content' />

        <Paragraph style={styles.paragraph}>
          Write down and store this recovery key in a safe place – it&#39;s the only
          way you can recover your wallet if you would lose or break your phone.
        </Paragraph>

        <MnemonicWordsContainer phrase={mnemonic} style={styles.mnemonic} />

        <Footer>
          <Button
            label='I have saved these words'
            onPress={this._showConfirmMnemonicScreen.bind(this)}
            style={styles.button}
            disabled={!this.props.recoveryKeyRevealed}
          />

          {this._renderICloudLink()}
        </Footer>
      </BaseScreen>
    );
  }
}

MnemonicScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  recoveryKeyRevealed: PropTypes.bool
};
