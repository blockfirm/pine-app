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
  footerParagraph: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16
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
      <BaseScreen style={styles.view} headerTitle='Lightning Payments'>
        {/*<Image source={confettiImage} style={styles.confetti} />*/}

        <Paragraph style={styles.paragraph}>
          Lightning payments are cheaper and faster than conventional bitcoin payments.
          Connect Pine to Lightning to enjoy seamless Lightning payments while still
          holding on to your private keys.
        </Paragraph>
  
        <Footer>
          <Paragraph style={styles.footerParagraph}>
            The Lightning integration is in beta which means it's not feature-complete
            and might have bugs. You will get some satoshis to try with so you don't
            have to risk your own.
          </Paragraph>

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
