import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as keyActions from '../../actions/keys';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import MnemonicWordsContainer from '../../containers/MnemonicWordsContainer';
import BackButton from '../../components/BackButton';
import SettingsAttribute from '../../components/SettingsAttribute';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsDescription from '../../components/SettingsDescription';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  view: {
    padding: 20,
    overflow: 'hidden'
  },
  blur: {
    top: -20,
    bottom: -20,
    left: -10,
    right: -10
  }
});

@connect((state) => ({
  keys: state.keys.items
}))
export default class ShowMnemonicScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Recovery Key',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  state = {
    phrase: '',
    storeInICloud: false
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    getMnemonicByKey(defaultKey.id).then((mnemonic) => {
      this.setState({ phrase: mnemonic });

      return dispatch(keyActions.recover()).then((recoveredMnemonic) => {
        if (recoveredMnemonic !== mnemonic) {
          return;
        }

        this.setState({ storeInICloud: true });
      });
    });
  }

  _updateICloudState(storeInICloud) {
    const dispatch = this.props.dispatch;
    const mnemonic = this.state.phrase;

    this.setState({ storeInICloud });

    if (storeInICloud) {
      return dispatch(keyActions.backup(mnemonic));
    }

    return dispatch(keyActions.removeBackup());
  }

  _onStoreInICloudChange(storeInICloud) {
    const activate = !this.state.storeInICloud && storeInICloud;
    let title;
    let message;
    let buttonText;
    let buttonStyle;

    if (activate) {
      title = 'Back up in iCloud?';
      message = 'Saving your recovery key in your iCloud account is potentially less secure than writing it down and storing it yourself.';
      buttonText = 'Back up in iCloud';
      buttonStyle = 'default';
    } else {
      title = 'Remove from iCloud?';
      message = 'Only remove your recovery key from iCloud if you have written it down and stored it yourself first.';
      buttonText = 'Remove from iCloud';
      buttonStyle = 'destructive';
    }

    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: buttonText,
          style: buttonStyle,
          onPress: this._updateICloudState.bind(this, storeInICloud)
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup style={styles.view}>
          <MnemonicWordsContainer phrase={this.state.phrase} blurStyle={styles.blur} />
        </SettingsGroup>
        <SettingsDescription>
          Write down and store this recovery key in a safe place so you can recover
          your wallet if you would lose or break your phone.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsAttribute
            name='Back up in iCloud'
            value={this.state.storeInICloud}
            onValueChange={this._onStoreInICloudChange.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          Saving your recovery key in your iCloud account is potentially less secure than writing it down and storing it yourself.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

ShowMnemonicScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  keys: PropTypes.object
};
