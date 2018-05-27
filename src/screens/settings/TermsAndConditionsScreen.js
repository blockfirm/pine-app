/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import Title from '../../components/Title';
import Paragraph from '../../components/Paragraph';
import BackButton from '../../components/BackButton';
import DoneButton from '../../components/DoneButton';
import SettingsGroup from '../../components/SettingsGroup';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  view: {
    padding: 20
  },
  title: {
    fontFamily: 'Arial',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
    marginTop: 10
  },
  paragraphWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  paragraph: {
    fontFamily: 'Arial',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'justify',
    color: '#000000'
  }
});

@connect()
export default class TermsAndConditionsScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params;
    const isModal = params ? params.isModal : false;
    const headerLeft = isModal ? <Text /> : <BackButton onPress={() => { navigation.goBack(); }} />;
    const headerRight = isModal ? <DoneButton onPress={screenProps.dismiss} /> : null;

    return {
      title: 'Terms and Conditions',
      headerStyle: headerStyles.header,
      headerTitleStyle: headerStyles.title,
      headerLeft: headerLeft,
      headerRight: headerRight,

      // HACK: Hack to disable the back navigation when this is the initial screen.
      gestureResponseDistance: isModal ? { horizontal: -1, vertical: 135 } : undefined
    };
  };

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup style={styles.view}>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
              Last updated: April 03, 2018
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              These Terms and Conditions ("Terms", "Terms and Conditions") govern your
              relationship with Payla mobile application (the "Service") operated by
              Blockfirm AB ("us", "we", or "our").
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Please read these Terms and Conditions carefully before using our Payla
              mobile application (the "Service").
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Your access to and use of the Service is conditioned on your acceptance of and
              compliance with these Terms. These Terms apply to all visitors, users and
              others who access or use the Service.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              By accessing or using the Service you agree to be bound by these Terms. If you
              disagree with any part of the terms then you may not access the Service.
            </Paragraph>
          </View>

          <Title style={styles.title}>
            Intellectual Property
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
              The Service and its original content, features and functionality are and will
              remain the exclusive property of Blockfirm AB and its licensors. The Service is
              protected by copyright, trademark, and other laws of both the Sweden and foreign
              countries.
            </Paragraph>
          </View>

          <Title style={styles.title}>
            Links To Other Web Sites
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
              Our Service may contain links to third-party web sites or services that are
              not owned or controlled by Blockfirm AB.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Blockfirm AB has no control over, and assumes no responsibility for, the
              content, privacy policies, or practices of any third party web sites or
              services. You further acknowledge and agree that Blockfirm AB shall not be
              responsible or liable, directly or indirectly, for any damage or loss caused
              or alleged to be caused by or in connection with use of or reliance on any
              such content, goods or services available on or through any such web sites or
              services.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              We strongly advise you to read the terms and conditions and privacy policies
              of any third-party web sites or services that you visit.
            </Paragraph>
          </View>

          <Title style={styles.title}>
            Limitation Of Liability
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
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

          <Title style={styles.title}>
            Disclaimer
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
              Your use of the Service is at your sole risk. The Service is provided on an
              "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties
              of any kind, whether express or implied, including, but not limited to,
              implied warranties of merchantability, fitness for a particular purpose, non-
              infringement or course of performance.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Blockfirm AB its subsidiaries, affiliates, and its licensors do not warrant
              that a) the Service will function uninterrupted, secure or available at any
              particular time or location; b) any errors or defects will be corrected; c)
              the Service is free of viruses or other harmful components; or d) the results
              of using the Service will meet your requirements.
            </Paragraph>
          </View>

          <Title style={styles.title}>
            Governing Law
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
              These Terms shall be governed and construed in accordance with the laws of
              Sweden, without regard to its conflict of law provisions.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Our failure to enforce any right or provision of these Terms will not be
              considered a waiver of those rights. If any provision of these Terms is held
              to be invalid or unenforceable by a court, the remaining provisions of these
              Terms will remain in effect. These Terms constitute the entire agreement
              between us regarding our Service, and supersede and replace any prior
              agreements we might have between us regarding the Service.
            </Paragraph>
          </View>

          <Title style={styles.title}>
            Changes
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
              We reserve the right, at our sole discretion, to modify or replace these Terms
              at any time. If a revision is material we will try to provide at least 30 days
              notice prior to any new terms taking effect. What constitutes a material
              change will be determined at our sole discretion.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              By continuing to access or use our Service after those revisions become
              effective, you agree to be bound by the revised terms. If you do not agree to
              the new terms, please stop using the Service.
            </Paragraph>
          </View>

          <Title style={styles.title}>
            Contact Us
          </Title>
          <View style={styles.paragraphWrapper}>
            <Paragraph style={styles.paragraph}>
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
  navigation: PropTypes.any
};
