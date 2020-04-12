/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../../contexts/theme';
import BtcLabelContainer from '../../containers/BtcLabelContainer';
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
    headerTitle: <HeaderTitle title='About Beta' />,
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
          <Title style={[titleStyles, { marginTop: 0 }]}>
            Welcome to the private beta for Pine's Lightning integration!
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              Pine's Lightning integration is finally in beta! It is non-custodial, meaning
              that you own your private keys and that Pine does not have access to them. And
              it does not require you to run your own Lightning node. Instead, a "virtual" node
              is running in the cloud and is communicating securely with the app to sign
              transactions, etc.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Keep in mind that the integration is not complete, and once it comes out of beta
              you won't have to think about opening and closing channels or even think about
              whether your funds are on-chain or off-chain – it will all be automatic.
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
          </View>

          <Title style={titleStyles}>
            Getting Started
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              <Text>To get started using Lightning with Pine, you need at least </Text>
              <BtcLabelContainer amount={0.0002} />
              <Text> on-chain in your wallet. From the Home screen, swipe right to
              find your address and QR code that you can use to transfer funds to
              your wallet.</Text>
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Now you can open a Lightning channel. Do this by pressing on your balance
              on the Home screen and then on Off-chain Balance and then Open Channel.
              Pick the amount you would like to move to the channel and press Open.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Wait while the funding transaction is being confirmed (~10-60 mins).
              Once confirmed you can pay Lightning invoices by scanning a QR code
              or pasting an invoice. You can also pay other Pine users by adding
              them as contacts and sending a payment.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Please note that with Lightning it is not enough that you have the
              funds to make a payment, but the recipient also needs to have sufficient
              inbound capacity to receive it.
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
              <Text>All you have to do is to take a screenshot and then share it as
              Beta Feedback. You can also email </Text>
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
