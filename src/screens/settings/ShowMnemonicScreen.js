import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsDescription from '../../components/SettingsDescription';
import MnemonicWords from '../../components/MnemonicWords';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  view: {
    padding: 20
  }
});

@connect((state) => ({
  keys: state.keys.items
}))
export default class ShowMnemonicScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Recovery Phrase',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  state = {
    phrase: ''
  }

  componentDidMount() {
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    getMnemonicByKey(defaultKey.id).then((mnemonic) => {
      this.setState({
        phrase: mnemonic
      });
    });
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup style={styles.view}>
          <MnemonicWords phrase={this.state.phrase} />
        </SettingsGroup>
        <SettingsDescription>
          Write down and store this recovery key in a safe place so you can recover
          your wallet if you lose or break your phone.
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
