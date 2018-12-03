import React, { Component } from 'react';
import { StyleSheet, StatusBar, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import headerStyles from '../styles/headerStyles';
import MnemonicWordsContainer from '../containers/MnemonicWordsContainer';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import CancelButton from '../components/CancelButton';
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
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params;
    const isModal = params ? params.isModal : false;
    const headerLeft = isModal ? <Text /> : <BackButton onPress={() => { navigation.goBack(); }} />;
    const headerRight = isModal ? <CancelButton onPress={screenProps.dismiss} /> : null;

    return {
      title: 'Your Recovery Key',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft,
      headerRight
    };
  };

  _showConfirmMnemonicScreen() {
    const navigation = this.props.navigation;
    const { mnemonic, isModal } = navigation.state.params;

    navigation.navigate('ConfirmMnemonic', { mnemonic, isModal });
  }

  render() {
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;

    return (
      <BaseScreen hideHeader={true}>
        <StatusBar barStyle='dark-content' />

        <Paragraph style={styles.paragraph}>
          Write down and store this recovery key in a safe place so you can recover your account if you would lose or break your phone.
        </Paragraph>

        <MnemonicWordsContainer phrase={mnemonic} style={styles.mnemonic} />

        <Footer>
          <Button
            label='I have saved these words'
            onPress={this._showConfirmMnemonicScreen.bind(this)}
            style={styles.button}
            disabled={!this.props.recoveryKeyRevealed}
          />
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
