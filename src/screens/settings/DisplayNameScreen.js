import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { parse as parseAddress } from '../../clients/paymentServer/address';
import { update as updateUser } from '../../clients/paymentServer/user';
import { save as saveSettings } from '../../actions/settings';
import { handle as handleError } from '../../actions/error/handle';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import HeaderButton from '../../components/buttons/HeaderButton';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsInput from '../../components/SettingsInput';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect((state) => ({
  keys: state.keys.items,
  userProfile: state.settings.user.profile
}))
export default class DisplayNameScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const doneIsDisabled = !navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');
    const headerRight = <HeaderButton label='Done' onPress={submit} disabled={doneIsDisabled} />;

    return {
      title: 'Display Name',
      headerStyle: headerStyles.header,
      headerTitleStyle: headerStyles.title,
      headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />),
      headerRight
    };
  };

  state = {
    submitting: false
  }

  constructor(props) {
    super(...arguments);

    const { username } = parseAddress(props.userProfile.address);

    this.state = {
      displayName: props.userProfile.displayName,
      username
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ canSubmit: false });
    this.props.navigation.setParams({ submit: this._onSubmit.bind(this) });
  }

  _getMnemonic() {
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    return getMnemonicByKey(defaultKey.id);
  }

  _goBack() {
    this.props.navigation.goBack();
  }

  _saveUserProfile(user) {
    const { dispatch } = this.props;
    const { username } = this.state;
    const { displayName } = user;

    dispatch(saveSettings({
      user: {
        profile: {
          displayName: displayName || username
        }
      }
    }));
  }

  _onSubmit() {
    const { dispatch } = this.props;
    const { address } = this.props.userProfile;
    const displayName = this.state.displayName.trim() || this.state.username;

    this.props.navigation.setParams({ canSubmit: false });
    this.setState({ submitting: true });

    return this._getMnemonic()
      .then((mnemonic) => {
        return updateUser({ displayName }, { address, mnemonic });
      })
      .then((user) => {
        this._saveUserProfile(user);
        this._goBack();
      })
      .catch((error) => {
        dispatch(handleError(error));
        this.props.navigation.setParams({ canSubmit: true });
        this.setState({ submitting: false });
      });
  }

  _onChangeText(text) {
    this.setState({ displayName: text });

    if (text === this.props.userProfile.displayName) {
      this.props.navigation.setParams({ canSubmit: false });
    } else {
      this.props.navigation.setParams({ canSubmit: true });
    }
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsInput
            value={this.state.displayName}
            placeholder={this.state.username}
            onChangeText={this._onChangeText.bind(this)}
            onSubmitEditing={this._onSubmit.bind(this)}
            disabled={this.state.submitting}
            maxLength={50}
          />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

DisplayNameScreen.propTypes = {
  keys: PropTypes.object,
  userProfile: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
