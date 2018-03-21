import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Link from '../components/Link';
import BaseScreen from './BaseScreen';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  title: {
    marginBottom: windowDimensions.height < 600 ? 10 : 20
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

  _createKey() {

  }

  _recoverKey() {

  }

  render() {
    return (
      <BaseScreen>
        <Title style={styles.title}>
          Welcome to Wallet ID
        </Title>

        <Paragraph>
          Start by creating a new key.
        </Paragraph>

        <Footer>
          <Button
            label='Create a new key'
            loadingLabel='Creating key...'
            onPress={this._createKey.bind(this)}
            style={styles.button}
          />

          <Link onPress={this._recoverKey.bind(this)}>
            Or recover an existing Wallet ID key
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
