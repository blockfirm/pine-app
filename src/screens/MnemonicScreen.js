import React, { Component } from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import headerStyles from '../styles/headerStyles';
import MnemonicWordsContainer from '../containers/MnemonicWordsContainer';
import Paragraph from '../components/Paragraph';
import CancelButton from '../components/CancelButton';
import HeaderButton from '../components/buttons/HeaderButton';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between'
  },
  mnemonic: {
    marginBottom: ifIphoneX(100, 20)
  },
  paragraph: {
    textAlign: 'center',
    marginTop: ifIphoneX(100, 45)
  }
});

@connect((state) => ({
  recoveryKeyRevealed: state.recoveryKey.visible
}))
export default class MnemonicScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const isModal = navigation.getParam('isModal') || false;
    const canSubmit = navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');
    const headerLeft = isModal ? <CancelButton onPress={screenProps.dismiss} /> : undefined;
    const headerRight = <HeaderButton label='Next' onPress={submit} disabled={!canSubmit} />;

    return {
      title: 'Your Recovery Key',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft,
      headerRight
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ canSubmit: false });
    this.props.navigation.setParams({ submit: this._showConfirmMnemonicScreen.bind(this) });
  }

  componentDidUpdate(prevProps) {
    const prevRecoveryKeyRevealed = prevProps.recoveryKeyRevealed;
    const recoveryKeyRevealed = this.props.recoveryKeyRevealed;

    if (recoveryKeyRevealed && !prevRecoveryKeyRevealed) {
      this.props.navigation.setParams({ canSubmit: true });
    }
  }

  _showConfirmMnemonicScreen() {
    const navigation = this.props.navigation;
    const { mnemonic, isModal } = navigation.state.params;

    navigation.navigate('ConfirmMnemonic', { mnemonic, isModal });
  }

  render() {
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;

    return (
      <BaseScreen hideHeader={true} style={styles.view}>
        <StatusBar barStyle='dark-content' />

        <Paragraph style={styles.paragraph}>
          Write down and store this recovery key in a safe place so you can recover your account if you would lose or break your phone.
        </Paragraph>

        <MnemonicWordsContainer phrase={mnemonic} style={styles.mnemonic} />

        <View>{ /* This acts as a spacer to place the mnemonic in the center. */ }</View>
      </BaseScreen>
    );
  }
}

MnemonicScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  recoveryKeyRevealed: PropTypes.bool
};
