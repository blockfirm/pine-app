/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../../contexts/theme';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  view: {
    padding: 20,
    paddingTop: 35
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.08,
    textAlign: 'left',
    marginTop: 20
  },
  title2: {
    fontSize: 15,
    lineHeight: 17,
    marginTop: 10
  },
  title3: {
    fontSize: 13,
    lineHeight: 15,
    marginTop: 10
  },
  paragraphWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  paragraph: {
    width: '100%',
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: -0.08,
    marginBottom: 15
  },
  listItem: {
    marginBottom: 5
  }
});

@connect()
class AboutBetaScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='About Lightning Beta' />,
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });

  _openTwitter() {
    Linking.openURL('https://twitter.com/pinewalletco');
  }

  _openEmail() {
    Linking.openURL('mailto:hi@pine.pm');
  }

  render() {
    const { theme } = this.props;
    const titleStyles = [styles.title, theme.title];
    const paragraphStyles = [styles.paragraph, theme.text];

    return (
      <BaseSettingsScreen>
        <SettingsGroup style={styles.view}>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              Lightning payments are cheaper and faster than conventional bitcoin payments.
              Connect Pine to Lightning to enjoy seamless Lightning payments while still
              holding on to your private keys, which only you have access to. And
              it does not require you to run your own Lightning node. Instead, a "virtual"
              node is running in the cloud and is communicating securely with the app to sign
              transactions, etc.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Disclaimer: This is an early beta, don't try it with more money than you are
              willing to lose.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Getting Started
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              1. Send some bitcoin to your wallet
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              2. Wait for it to confirm
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              3. Go to Settings → Lightning → Balance &amp; Capacity
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              4. Press Open Channel and pick a funding amount to open a channel
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              5. Wait until it is confirmed
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              6. You can now send Lightning payments!
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              7. You can only receive payments once you've made some Lightning payments
              and have inbound capacity
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Features
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              ⚡️ Send Pine Lightning payments
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              ⚡️ Receive Pine Lightning payments
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              ⚡️ Send non-Pine Lightning payments
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              ⚡️ Manually open and close your Lightning channel
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Coming Soon
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              🔜 Receive non-Pine Lightning payments
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              🔜 Pay to bitcoin addresses using Lightning
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              🔜 Automatic management of Lightning funds
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              🔜 Independent recovery of Lightning funds
            </Paragraph>
            <Paragraph style={[paragraphStyles, styles.listItem]}>
              🔜 Rent inbound channel capacity
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Share Feedback
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              All feedback is welcome – whether you've stumbled upon a bug,
              have some suggestions for improvement or just want to express
              some love!
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              <Text>Email </Text>
              <Text style={theme.link} onPress={this._openEmail.bind(this)}>hi@pine.pm</Text>
              <Text> or tweet at </Text>
              <Text style={theme.link} onPress={this._openTwitter.bind(this)}>@pinewalletco</Text>
              <Text>.</Text>
            </Paragraph>
          </View>
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

AboutBetaScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(AboutBetaScreen);
