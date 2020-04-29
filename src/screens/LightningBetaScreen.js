import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { reset as navigateWithReset } from '../actions/navigate';
import headerStyles from '../styles/headerStyles';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

//const confettiImage = require('../images/illustrations/Confetti.png');

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    marginBottom: 20
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
export default class LightningBetaScreen extends Component {
  static navigationOptions = () => ({
    header: null
  });

  _activate() {
    const { navigation } = this.props;
    navigation.navigate('ActivatingLightning');
  }

  render() {
    return (
      <BaseScreen style={styles.view} hideHeader={true}>
        {/*<Image source={confettiImage} style={styles.confetti} />*/}

        <Title style={styles.title}>
          Welcome to Pine's Lightning Beta!
        </Title>
 
        <Paragraph style={styles.paragraph}>
          This beta allows you for the first time try out the Lightning Network with Pine.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          Pine is non-custodial, including the Lightning integration. This means that Pine
          signs all transactions on your device without having access to your private keys.
        </Paragraph>

        <Footer>
          <Button
            label='Activate Lightning'
            onPress={this._activate.bind(this)}
            runAfterInteractions={true}
          />
        </Footer>
      </BaseScreen>
    );
  }
}

LightningBetaScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
