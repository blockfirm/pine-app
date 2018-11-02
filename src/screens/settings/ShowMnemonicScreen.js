import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as keyActions from '../../actions/keys';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsAttribute from '../../components/SettingsAttribute';
import SettingsButton from '../../components/SettingsButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsDescription from '../../components/SettingsDescription';
import BaseSettingsScreen from './BaseSettingsScreen';

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

  _backUpManually() {
    const navigation = this.props.navigation;

    navigation.navigate('MnemonicModal', {
      mnemonic: this.state.phrase,
      isModal: true
    });
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsAttribute
            name='Back up in iCloud'
            value={this.state.storeInICloud}
            onValueChange={this._onStoreInICloudChange.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          Saving your recovery key in iCloud is safe and convenient as long as you keep your iCloud account secure.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsButton title='Back up Manually' onPress={this._backUpManually.bind(this)} isLastItem={true} />
        </SettingsGroup>
        <SettingsDescription>
          Backing up your recovery key manually on a piece of paper is a good alternative in case you would
          lose access to your iCloud account, or if you don&#39;t want to store your key in iCloud.
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
