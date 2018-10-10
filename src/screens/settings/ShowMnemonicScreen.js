import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import MnemonicWordsContainer from '../../containers/MnemonicWordsContainer';
import BackButton from '../../components/BackButton';
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
          <MnemonicWordsContainer phrase={this.state.phrase} blurStyle={styles.blur} />
        </SettingsGroup>
        <SettingsDescription>
          Write down and store this recovery key in a safe place so you can recover
          your wallet if you would lose or break your phone.
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
