import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../contexts/theme';
import { reset as navigateWithReset } from '../actions/navigate';
import { save as saveSettings } from '../actions/settings';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Link from '../components/Link';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const ILLUSTRATION_LIGHT = require('../images/illustrations/ActivateLightningLight.png');
const ILLUSTRATION_DARK = require('../images/illustrations/ActivateLightningDark.png');

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
    textAlign: 'center',
    marginBottom: 150
  },
  footerParagraph: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16
  },
  link: {
    marginTop: 10
  },
  illustration: {
    width: 124,
    height: 171,
    marginBottom: 80
  }
});

@connect()
class ActivateLightningScreen extends Component {
  static navigationOptions = () => ({
    header: null
  });

  _activate() {
    const { navigation } = this.props;
    navigation.navigate('ActivatingLightning');
  }

  _skip() {
    const { dispatch } = this.props;

    dispatch(saveSettings({
      lightning: { isSetup: true }
    }));

    dispatch(navigateWithReset('Home'));
  }

  render() {
    const { theme } = this.props;
    const illustration = theme.name === 'dark' ? ILLUSTRATION_DARK : ILLUSTRATION_LIGHT;

    return (
      <BaseScreen style={styles.view} headerTitle='Lightning Payments'>
        <Image source={illustration} style={styles.illustration} />

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

          <Link
            onPress={this._skip.bind(this)}
            style={styles.link}
          >
            Activate Later in Settings
          </Link>
        </Footer>
      </BaseScreen>
    );
  }
}

ActivateLightningScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(ActivateLightningScreen);
