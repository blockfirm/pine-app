import React, { Component } from 'react';
import { StyleSheet, StatusBar, Dimensions, View, Image, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { handle as handleError } from '../actions/error';
import generateMnemonic from '../crypto/generateMnemonic';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Link from '../components/Link';
import BaseScreen from './BaseScreen';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  backgroundImage: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  blackGradient: {
    alignSelf: 'stretch',
    height: 70
  },
  whiteGradient: {
    flex: 1,
    alignSelf: 'stretch'
  },
  iconWrapper: {
    position: 'absolute',
    paddingBottom: 100,
    shadowColor: 'black',
    shadowRadius: 20,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 23
  },
  footer: {
    backgroundColor: 'transparent'
  },
  button: {
    marginBottom: 10
  }
});

@connect()
export default class WelcomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _showMnemonicScreen(mnemonic) {
    const navigation = this.props.navigation;
    navigation.navigate('Mnemonic', { mnemonic });
  }

  _createWallet() {
    const dispatch = this.props.dispatch;

    return generateMnemonic()
      .then((mnemonic) => {
        this._showMnemonicScreen(mnemonic);
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _importWallet() {
    const navigation = this.props.navigation;
    navigation.navigate('ImportMnemonic');
  }

  render() {
    return (
      <BaseScreen>
        <StatusBar barStyle='light-content' />

        <View style={styles.background}>
          <ImageBackground source={require('../images/Background.png')} style={styles.backgroundImage}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
              style={styles.blackGradient}
            />

            <LinearGradient
              colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
              locations={[0.25, 0.9]}
              style={styles.whiteGradient}
            />

            <View style={styles.iconWrapper}>
              <Image source={require('../images/IconWelcomeScreen.png')} style={styles.icon} />
            </View>
          </ImageBackground>
        </View>

        <Footer style={styles.footer}>
          <Button
            label='Create a new wallet'
            loadingLabel='Creating wallet...'
            onPress={this._createWallet.bind(this)}
            style={styles.button}
          />

          <Link onPress={this._importWallet.bind(this)}>
            Or import an existing wallet
          </Link>
        </Footer>
      </BaseScreen>
    );
  }
}

WelcomeScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
