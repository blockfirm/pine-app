/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../../contexts/theme';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import BackButton from '../../components/BackButton';
import DoneButton from '../../components/DoneButton';
import SettingsGroup from '../../components/SettingsGroup';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  view: {
    padding: 20,
    paddingTop: 35
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 15,
    letterSpacing: -0.08,
    textAlign: 'left',
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
  }
});

@connect()
class TermsAndConditionsScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params;
    const isModal = params ? params.isModal : false;
    const headerLeft = isModal ? <Text /> : <BackButton onPress={() => { navigation.goBack(); }} />;
    const headerRight = isModal ? <DoneButton onPress={screenProps.dismiss} /> : null;

    return {
      headerTransparent: true,
      headerBackground: <SettingsHeaderBackground />,
      headerTitle: <HeaderTitle title='Terms and Conditions' />,
      headerLeft,
      headerRight
    };
  };

  render() {
    const { theme } = this.props;
    const titleStyles = [styles.title, theme.title];
    const paragraphStyles = [styles.paragraph, theme.text];

    return (
      <BaseSettingsScreen>
        <SettingsGroup style={styles.view}>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              Last updated: November 16, 2018
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              These Terms and Conditions ("Terms", "Terms and Conditions") govern your
              relationship with Pine mobile application (the "Service") operated by
              Blockfirm AB ("us", "we", or "our").
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Please read these Terms and Conditions carefully before using our Pine
              mobile application (the "Service").
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Your access to and use of the Service is conditioned on your acceptance of and
              compliance with these Terms. These Terms apply to all visitors, users and
              others who access or use the Service.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              By accessing or using the Service you agree to be bound by these Terms. If you
              disagree with any part of the terms then you may not access the Service.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Intellectual Property
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              The Service and its original content, features and functionality are and will
              remain the exclusive property of Blockfirm AB and its licensors. The Service is
              protected by copyright, trademark, and other laws of both Sweden and foreign
              countries.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Links To Other Web Sites
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              Our Service may contain links to third-party web sites or services that are
              not owned or controlled by Blockfirm AB.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Blockfirm AB has no control over, and assumes no responsibility for, the
              content, privacy policies, or practices of any third party web sites or
              services. You further acknowledge and agree that Blockfirm AB shall not be
              responsible or liable, directly or indirectly, for any damage or loss caused
              or alleged to be caused by or in connection with use of or reliance on any
              such content, goods or services available on or through any such web sites or
              services.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              We strongly advise you to read the terms and conditions and privacy policies
              of any third-party web sites or services that you visit.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Limitation Of Liability
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              In no event shall Blockfirm AB, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect, incidental,
              special, consequential or punitive damages, including without limitation, loss
              of profits, data, use, goodwill, or other intangible losses, resulting from
              (i) your access to or use of or inability to access or use the Service; (ii)
              any conduct or content of any third party on the Service; (iii) any content
              obtained from the Service; and (iv) unauthorized access, use or alteration of
              your transmissions or content, whether based on warranty, contract, tort
              (including negligence) or any other legal theory, whether or not we have been
              informed of the possibility of such damage, and even if a remedy set forth
              herein is found to have failed of its essential purpose.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Disclaimer
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              Your use of the Service is at your sole risk. The Service is provided on an
              "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties
              of any kind, whether express or implied, including, but not limited to,
              implied warranties of merchantability, fitness for a particular purpose, non-
              infringement or course of performance.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Blockfirm AB its subsidiaries, affiliates, and its licensors do not warrant
              that a) the Service will function uninterrupted, secure or available at any
              particular time or location; b) any errors or defects will be corrected; c)
              the Service is free of viruses or other harmful components; or d) the results
              of using the Service will meet your requirements.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Governing Law
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              These Terms shall be governed and construed in accordance with the laws of
              Sweden, without regard to its conflict of law provisions.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              Our failure to enforce any right or provision of these Terms will not be
              considered a waiver of those rights. If any provision of these Terms is held
              to be invalid or unenforceable by a court, the remaining provisions of these
              Terms will remain in effect. These Terms constitute the entire agreement
              between us regarding our Service, and supersede and replace any prior
              agreements we might have between us regarding the Service.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Changes
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              We reserve the right, at our sole discretion, to modify or replace these Terms
              at any time. If a revision is material we will try to provide at least 30 days
              notice prior to any new terms taking effect. What constitutes a material
              change will be determined at our sole discretion.
            </Paragraph>
            <Paragraph style={paragraphStyles}>
              By continuing to access or use our Service after those revisions become
              effective, you agree to be bound by the revised terms. If you do not agree to
              the new terms, please stop using the Service.
            </Paragraph>
          </View>

          <Title style={titleStyles}>
            Contact Us
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={paragraphStyles}>
              If you have any questions about these Terms, please contact us.
            </Paragraph>
          </View>
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

TermsAndConditionsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(TermsAndConditionsScreen);
