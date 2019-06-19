import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { reset as navigateWithReset } from '../actions/navigate';
import headerStyles from '../styles/headerStyles';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const confettiImage = require('../images/illustrations/Confetti.png');

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  paragraph: {
    textAlign: 'center'
  },
  confetti: {
    width: 100,
    height: 96,
    marginBottom: 40
  }
});

@connect()
export default class BetaScreen extends Component {
  static navigationOptions = () => {
    return {
      title: 'Welcome to the beta!',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title
    };
  };

  _signOut() {
    const { dispatch } = this.props;
    const keepSettings = false;
    const keepBackup = true;

    dispatch(navigateWithReset('Reset', { keepSettings, keepBackup }));
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <Image source={confettiImage} style={styles.confetti} />

        <Paragraph style={styles.paragraph}>
          Pine's alpha period has ended and is now in beta! This means that the app
          is now using real bitcoins on the mainnet. Please sign out and create a new account.
        </Paragraph>

        <Footer>
          <Button
            label='Sign Out'
            onPress={this._signOut.bind(this)}
            runAfterInteractions={true}
          />
        </Footer>
      </BaseScreen>
    );
  }
}

BetaScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
