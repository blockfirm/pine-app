import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import headerStyles from '../styles/headerStyles';
import StyledText from './StyledText';
import Paragraph from './Paragraph';
import SmallButton from './buttons/SmallButton';

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  wrapper: {
    alignItems: 'center'
  },
  illustration: {
    width: 108,
    height: 108,
    marginBottom: 40
  },
  paragraph: {
    textAlign: 'center',
    lineHeight: 22,
    paddingTop: 17,
    marginBottom: 40,
    paddingLeft: 15,
    paddingRight: 15
  }
});

class ContactListEmpty extends Component {
  render() {
    const { theme } = this.props;

    return (
      <View style={styles.view}>
        <View style={styles.wrapper}>
          <Image source={theme.illustrationNoContacts} style={styles.illustration} />

          <StyledText style={[headerStyles.title, theme.title]}>
            It&#39;s lonely here
          </StyledText>
          <Paragraph style={styles.paragraph}>
            Add a contact to start sending and receiving bitcoin.
          </Paragraph>

          <SmallButton label='Add Contact' onPress={this.props.onAddContactPress} />
        </View>
      </View>
    );
  }
}

ContactListEmpty.propTypes = {
  address: PropTypes.string,
  onAddContactPress: PropTypes.func,
  theme: PropTypes.object.isRequired
};

export default withTheme(ContactListEmpty);
